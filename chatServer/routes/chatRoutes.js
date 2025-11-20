import express from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { sendMessage, getMessages } from "../controllers/chatController.js";

const router = express.Router();

router.post("/send", verifyJWT, sendMessage);
router.get("/messages/:userId", verifyJWT, getMessages);

export default router;
