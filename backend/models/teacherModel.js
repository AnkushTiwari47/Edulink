import mongoose, { Mongoose } from "mongoose";
const TeacherSchema = mongoose.Schema({
        teacherId: {
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
        fees:{type:String
        },
        bio:{type:String
        },
        college:{type:String
        },
        qualifications:{type:String
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
const Teacher =mongoose.model("Teacher",TeacherSchema)
export default Teacher