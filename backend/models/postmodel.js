import mongoose, { Mongoose } from "mongoose";
const PostSchema =  mongoose.Schema({
        userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
        }, 
        objective:{
            type: String,
            required: true,
        },
      content:{
            type: String,
            required: true,
        },
},{
      timestamps:true
       })
const Post =mongoose.model("Post",PostSchema)
export default Post