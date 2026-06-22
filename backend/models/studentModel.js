import mongoose, { Mongoose } from "mongoose";
const StudentSchema = mongoose.Schema({
        studentId: {
        type: mongoose.Schema.Types.ObjectId,
         ref: "user"
        },
       
        subject: {type:[String],
        },
        photo:{type:String,
             default:""
        },
        location:{type:String
        },
        grade:{type:String
        },
        mode:{type: String,
            enum:["Online","Offline"]
        },
        phoneNo:{type:String,
             match:/^[0-9]{10}$/
        }

})
const Student =mongoose.model("Student",StudentSchema)
export default Student