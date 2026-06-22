import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({

participants: [
{
type: mongoose.Schema.Types.ObjectId,
ref: "user"
}
],

lastMessage:{
type:String
},

lastMessageTime:{
type:Date
}

},{timestamps:true})

export default mongoose.model("Conversation",conversationSchema);