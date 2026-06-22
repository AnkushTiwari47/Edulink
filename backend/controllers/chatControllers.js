import Conversation from "../models/conversationModel.js";
import Connection from "../models/connectionModel.js";
import Message from "../models/messageModel.js";

export const createConversation = async (req, res) => {

try {   
 
const userId = req.user.id;
const { receiverId } = req.body;

const connection = await Connection.findOne({
$or:[
{ sender:userId, receiver:receiverId },
{ sender:receiverId, receiver:userId }
],
status:"accepted"
});

if(!connection){
return res.status(403).json({
message:"You can only chat with connected users"
});
}

let conversation = await Conversation.findOne({
participants: { $all:[userId,receiverId] }
});

if(!conversation){

conversation = await Conversation.create({
participants:[userId,receiverId]
});

}

res.status(200).json(conversation);

}catch(error){
res.status(500).json({message:error.message});
}

};
//sending message=========================================
export const sendMessage = async (req,res)=>{

try{

const sender = req.user.id;
const { conversationId, text } = req.body;

const message = await Message.create({
conversationId,
sender,
message:text
});

await Conversation.findByIdAndUpdate(conversationId,{
lastMessage:text,
lastMessageTime:Date.now()
});

res.status(201).json(message);

}catch(error){
res.status(500).json({message:error.message});
}

};
//loading chat history================================================
export const getMessages = async (req,res)=>{

try{

const { conversationId } = req.params;

const messages = await Message.find({
conversationId
}).sort({createdAt:1});

res.status(200).json(messages);

}catch(error){
res.status(500).json({message:error.message});
}

}; 
//getting chat list==========================================
export const getUserConversations = async (req,res)=>{

try{

const userId = req.user.id;

const conversations = await Conversation.find({
participants:userId
})
.populate("participants","name photo")
.sort({updatedAt:-1});

res.status(200).json(conversations);

}catch(error){
res.status(500).json({message:error.message});
}

};
