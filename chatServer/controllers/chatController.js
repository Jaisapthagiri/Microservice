import Chat from "../models/Chat.js";
import { io, userSocketMap } from "../socketStore.js";

export const sendMessage = async (req, res) => {
  const { receiverId, text } = req.body;

  if (!receiverId || !text) {
    return res.status(400).json({ error: "receiverId and text required" });
  }

  try {
    const senderId = req.userId;

    if (!senderId) {
      return res.status(401).json({ error: "Unauthorized: senderId missing" });
    }

    const chat = await Chat.create({ senderId, receiverId, text });

    const msgPayload = {
      senderId,
      receiverId,
      text,
      createdAt: chat.createdAt,
    };

    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId && io) {
      io.to(receiverSocketId).emit("receiveMessage", msgPayload);
    }

    const senderSocketId = userSocketMap[senderId];
    if (senderSocketId && io && senderSocketId !== receiverSocketId) {
      io.to(senderSocketId).emit("receiveMessage", msgPayload);
    }

    res.json({ success: true, chat });
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  const { userId } = req.params;
  const senderId = req.userId;

  if (!senderId || !userId) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    const messages = await Chat.find({
      $or: [
        { senderId, receiverId: userId },
        { senderId: userId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
