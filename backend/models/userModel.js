import mongoose from "mongoose";
 const userSchema = new mongoose.Schema(
    {
        userId:{
            type: String,
            required: true,
            unique: true
        },
       name: {type: String,
        required: true,
        minlength: 3
        },
        email:{type: String,
            required: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
            unique: true

        }, 
        password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },
        photo:{type:String,
             default:""
        },
        role:{type: String,
            required: true,
            enum: ["Student","Teacher"],
            default: "Student"

        }

    }
 )
 const user = mongoose.model("user",userSchema);
 export default user