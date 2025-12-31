import { prisma } from "../db/prisma";
import { v4 as uuid } from "uuid";
import { generateReply } from "./llm";

export type ChatResult =
  | { reply: string; sessionId: string }
  | { error: string };

export async function handleChatMessage(
  message: string,
  sessionId?: string
): Promise<ChatResult> {
  // ✅ HARD STOP — NO THROW
  if (!message || !message.trim()) {
    return { error: "Message cannot be empty" };
  }

  const conversationId = sessionId ?? uuid();

  await prisma.conversation.upsert({
    where: { id: conversationId },
    update: {},
    create: { id: conversationId },
  });

  await prisma.message.create({
    data: {
      id: uuid(),
      conversationId,
      sender: "user",
      text: message,
    },
  });

  const history = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    take: 10,
  });

  const formattedHistory = history.map(
    (m) => `${m.sender === "ai" ? "AI" : "User"}: ${m.text}`
  );

  const reply = await generateReply(formattedHistory, message);

  await prisma.message.create({
    data: {
      id: uuid(),
      conversationId,
      sender: "ai",
      text: reply,
    },
  });

  return { reply, sessionId: conversationId };
}
