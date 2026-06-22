import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectDB =async () =>{
    try {
         await mongoose.connect(process.env.mongodbURI)
        console.log("mongodb connected")
    } catch (error) {
        console.log(error)
    }
}
export default connectDB