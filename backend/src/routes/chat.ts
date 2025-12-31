import { Router } from "express";
import { handleChatMessage } from "../services/chatService";

const router = Router();

router.post("/message", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    // Shape validation
    if (typeof message !== "string") {
      return res.status(400).json({ error: "Invalid message" });
    }

    const result = await handleChatMessage(message, sessionId);

    // ✅ Validation error → 400
    if ("error" in result) {
      return res.status(400).json(result);
    }

    // ✅ Success → 200
    return res.status(200).json(result);
  } catch (err) {
    console.error("UNEXPECTED ERROR:", err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

export default router;
