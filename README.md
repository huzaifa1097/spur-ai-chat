# 🚀 Spur AI Live Chat Agent

🌐 **Live Demo:** [https://spur-ai-chat-zeta.vercel.app](https://spur-ai-chat-zeta.vercel.app)  
📦 **Backend API:** [https://spur-ai-chat-backend-08ew.onrender.com](https://spur-ai-chat-backend-08ew.onrender.com)

---

## 📖 Overview

This project is a small but realistic AI-powered customer support chat system built as part of the Spur founding engineer take-home assignment.

It simulates a live support chat widget where an AI agent answers user questions about a fictional e-commerce store using a real LLM, with conversation persistence and robust error handling.

The focus is on:
- Correctness
- Robustness
- Clean architecture
- Product-quality UX

---

## 🧱 Tech Stack

### Backend
- Node.js
- TypeScript
- Express
- Prisma ORM
- SQLite
- Groq SDK (LLaMA 3.1)

### Frontend
- Svelte (Vite)
- Fetch API
- Vanilla CSS

---

## 🛠️ Local Setup

### 1️⃣ Clone the repository

```bash
git clone [https://github.com/huzaifa1097/spur-ai-chat.git](https://github.com/huzaifa1097/spur-ai-chat.git)
cd spur-ai-chat
```

### 🔧 Backend Setup

**2️⃣ Navigate to backend directory**
```bash
cd backend
```

**3️⃣ Install backend dependencies**
```bash
npm install
```

**4️⃣ Configure environment variables**
Create a `.env` file inside the `backend/` directory:

```env
GROQ_API_KEY=your_groq_api_key_here
```
> ⚠️ **Note:** Do NOT commit this file. It is already gitignored.

**5️⃣ Set up the database (Prisma)**
```bash
npx prisma migrate dev --name init
```
This will:
- Create the SQLite database
- Apply schema migrations
- Generate the Prisma client

*(Optional) Inspect the database:*
```bash
npx prisma studio
```

**6️⃣ Start the backend server**
```bash
npx ts-node-dev --respawn --transpile-only src/index.ts
```
Backend runs at: `http://localhost:3001`

### 🎨 Frontend Setup

**7️⃣ Navigate to frontend directory**
```bash
cd ../frontend
```

**8️⃣ Install frontend dependencies**
```bash
npm install
```

**9️⃣ Configure backend API URL (local development)**
Open the file: `frontend/src/lib/api.ts`

Set the API URL to:
```ts
const API_URL = "http://localhost:3001/chat/message";
```

**🔟 Start the frontend development server**
```bash
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## 📡 API Documentation

### POST `/chat/message`

**Request**
```json
{
  "message": "Do you ship to USA?",
  "sessionId": "optional-session-id"
}
```

**Response**
```json
{
  "reply": "Yes, we ship worldwide. Delivery to the USA takes 5–7 days.",
  "sessionId": "generated-or-existing-session-id"
}
```

---

## 🧪 Example API Test Cases (Postman / cURL)

### ✅ Normal message
```json
{
  "message": "What is your return policy?"
}
```

### ✅ Context continuation
```json
{
  "message": "How long does it take?",
  "sessionId": "<existing-session-id>"
}
```

### ❌ Empty message (validation)
```json
{
  "message": ""
}
```
**Expected:** `400 Bad Request`

### ❌ Invalid body
```json
{
  "foo": "bar"
}
```
**Expected:** `400 Bad Request`

### ⚠️ LLM failure handling
If the LLM API key is invalid or rate-limited, the backend returns:
```json
{
  "reply": "Sorry, something went wrong. Please try again.",
  "sessionId": "<session-id>"
}
```

---

## 🧠 Architecture Overview

### Backend Structure
```bash
backend/
├── src/
│   ├── routes/        # Express routes
│   ├── services/      # Business logic (chat, LLM)
│   ├── db/            # Prisma client
│   └── index.ts       # Server entry point
```

### Design Choices
- **Routes** are thin and focused on HTTP.
- **Services** contain all core logic.
- **LLM integration** is isolated for easy replacement.
- **Database schema** supports future multi-channel expansion.

---

## 🤖 LLM Integration

- **Provider:** Groq
- **Model:** llama-3.1-8b-instant

### Prompting Strategy
The AI is seeded with domain knowledge for a fictional ecommerce store:
- Shipping policy
- Returns and refunds
- Support hours

Conversation history is included so replies remain contextual.

### Guardrails
- Invalid input rejected early
- LLM/network errors handled gracefully
- Friendly fallback responses
- Token usage capped for predictability

---

## 🗂️ Data Model

**Conversation**
- `id`
- `createdAt`

**Message**
- `id`
- `conversationId`
- `sender` (user | ai)
- `text`
- `createdAt`

All messages are persisted and associated with a conversation.

---

## 🛡️ Robustness & Validation

- Empty messages return `400 Bad Request`
- Very long messages do not crash the server
- Backend never crashes on malformed input
- LLM/API failures surfaced gracefully
- No secrets are hard-coded

---

## ⚖️ Trade-offs & Future Improvements

### Trade-offs
- SQLite used locally for simplicity (Postgres-ready schema).
- Frontend does not auto-reload chat history on refresh.

### If I had more time…
- Add `GET /chat/history/:sessionId`
- Streaming responses for typing effect
- Rate limiting per session
- Multi-channel adapters (WhatsApp, Instagram)

---

## 🌍 Deployed URLs

- **Frontend:** [https://spur-ai-chat-zeta.vercel.app](https://spur-ai-chat-zeta.vercel.app)
- **Backend:** [https://spur-ai-chat-backend-08ew.onrender.com](https://spur-ai-chat-backend-08ew.onrender.com)

---

## 👤 About Me

**Abu Huzaifa Ahmad**

🌐 **Portfolio:** [https://huzaifa-portfolio-seven.vercel.app](https://huzaifa-portfolio-seven.vercel.app)  
💼 **LinkedIn:** [https://www.linkedin.com/in/abu-huzaifa-ahmad-68175222a](https://www.linkedin.com/in/abu-huzaifa-ahmad-68175222a)  
💻 **GitHub:** [https://github.com/huzaifa1097](https://github.com/huzaifa1097)  
📧 **Email:** [ahmadhuzaifa1097@gmail.com](mailto:ahmadhuzaifa1097@gmail.com)

🙏 Thank you for reviewing this submission. Happy to walk through any part of the implementation.
