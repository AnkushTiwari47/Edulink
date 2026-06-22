import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({

conversationId:{
type: mongoose.Schema.Types.ObjectId,
ref:"Conversation"
},

sender:{
type: mongoose.Schema.Types.ObjectId,
ref:"user"
},

message:{
type:String
},

seen:{
type:Boolean,
default:false
}

},{timestamps:true})

export default mongoose.model("Message",messageSchema);