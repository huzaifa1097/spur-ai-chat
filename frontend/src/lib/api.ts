const API_URL =
  "https://spur-ai-chat-backend-08ew.onrender.com/chat/message";

export async function sendMessage(
  message: string,
  sessionId?: string
) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, sessionId }),
  });

  return res.json();
}
