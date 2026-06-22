import express from "express";
import { createConversation,sendMessage, getMessages, getUserConversations } from "../controllers/chatControllers.js";
import{islogedIn} from "../middleware/authentication.js"

const router = express.Router();

router.post("/conversation", islogedIn, createConversation);

router.post("/message", islogedIn, sendMessage);

router.get("/messages/:conversationId", islogedIn, getMessages);

router.get("/conversations", islogedIn, getUserConversations);

export default router;  