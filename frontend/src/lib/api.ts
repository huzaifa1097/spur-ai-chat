export async function sendMessage(
  message: string,
  sessionId?: string
) {
  const res = await fetch("https://spur-ai-chat-backend-08ew.onrender.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId }),
  });

  return res.json();
}
