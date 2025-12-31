<script lang="ts">
  import { sendMessage } from "./lib/api";

  type ChatMessage = {
    sender: "user" | "ai";
    text: string;
  };

  let messages: ChatMessage[] = [];
  let input = "";
  let sessionId: string | null = null;
  let loading = false;
  let error: string | null = null;
  let bottomRef: HTMLDivElement;

  $: if (messages.length || loading) {
    setTimeout(() => bottomRef?.scrollIntoView({ behavior: "smooth" }), 0);
  }

  async function handleSend() {
    if (!input.trim() || loading) return;

    error = null;
    messages = [...messages, { sender: "user", text: input }];
    loading = true;

    const res = await sendMessage(input, sessionId ?? undefined);

    if (res.error) {
      error = res.error;
      loading = false;
      return;
    }

    sessionId = res.sessionId ?? sessionId;
    messages = [...messages, { sender: "ai", text: res.reply ?? "" }];
    input = "";
    loading = false;
  }
</script>

<style>
  :root {
    --bg: #0f172a;
    --card: rgba(255, 255, 255, 0.08);
    --border: rgba(255, 255, 255, 0.12);
    --user: linear-gradient(135deg, #2563eb, #4f46e5);
    --ai: rgba(255, 255, 255, 0.15);
    --text: #e5e7eb;
    --muted: #94a3b8;
  }

  body {
    background: radial-gradient(circle at top, #1e293b, #020617);
    font-family: Inter, system-ui, sans-serif;
  }

  .chat-shell {
    max-width: 460px;
    height: 640px;
    margin: 40px auto;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    backdrop-filter: blur(18px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
  }

  .header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    font-weight: 600;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .dot {
    width: 10px;
    height: 10px;
    background: #22c55e;
    border-radius: 50%;
  }

  .messages {
    flex: 1;
    padding: 18px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .bubble {
    max-width: 78%;
    padding: 12px 14px;
    border-radius: 14px;
    font-size: 14px;
    line-height: 1.5;
    animation: fadeUp 0.2s ease;
  }

  .user {
    align-self: flex-end;
    background: var(--user);
    color: white;
    border-bottom-right-radius: 4px;
  }

  .ai {
    align-self: flex-start;
    background: var(--ai);
    color: var(--text);
    border-bottom-left-radius: 4px;
  }

  .typing {
    font-style: italic;
    color: var(--muted);
  }

  .input-wrap {
    border-top: 1px solid var(--border);
    padding: 12px;
    display: flex;
    gap: 10px;
  }

  input {
    flex: 1;
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.05);
    color: var(--text);
    outline: none;
  }

  input::placeholder {
    color: var(--muted);
  }

  button {
    padding: 0 18px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.1s ease;
  }

  button:hover {
    transform: translateY(-1px);
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .error {
    text-align: center;
    font-size: 12px;
    color: #f87171;
    padding-bottom: 6px;
  }

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>

<div class="chat-shell">
  <div class="header">
    <div class="dot"></div>
    Spur Support Agent
  </div>

  <div class="messages">
    {#each messages as msg}
      <div class="bubble {msg.sender}">
        {msg.text}
      </div>
    {/each}

    {#if loading}
      <div class="bubble ai typing">Agent is typing…</div>
    {/if}

    <div bind:this={bottomRef}></div>
  </div>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  <div class="input-wrap">
    <input
      bind:value={input}
      placeholder="Ask about shipping, returns, support…"
      on:keydown={(e) => e.key === "Enter" && handleSend()}
    />
    <button on:click={handleSend} disabled={loading}>
      Send
    </button>
  </div>
</div>
