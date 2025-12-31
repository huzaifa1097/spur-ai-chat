import Groq from "groq-sdk";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

const FAQ_CONTEXT = `
You are a helpful support agent for a small ecommerce store.

Store info:
- Shipping: Worldwide. USA delivery takes 5–7 days.
- Returns: 7-day no-questions-asked return.
- Refunds: Processed in 5 business days.
- Support hours: Mon–Fri, 10am–6pm IST.
`;

export async function generateReply(
  history: string[],
  userMessage: string
) {
  try {
    const messages: ChatCompletionMessageParam[] = [];

    // System prompt
    messages.push({
      role: "system",
      content: FAQ_CONTEXT,
    });

    // Conversation history
    for (const m of history) {
      const role: "user" | "assistant" =
        m.startsWith("AI:") ? "assistant" : "user";

      messages.push({
        role,
        content: m.replace(/^AI: |^User: /, ""),
      });
    }

    // Current user message
    messages.push({
      role: "user",
      content: userMessage,
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      max_tokens: 200,
    });

    return completion.choices[0]?.message?.content ?? "";
  } catch (err) {
    console.error("GROQ ERROR:", err);
    return "Sorry, something went wrong. Please try again.";
  }
}
