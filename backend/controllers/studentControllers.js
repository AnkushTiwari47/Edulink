import user from "../models/userModel.js"
import Student from "../models/studentModel.js"
import Teacher from "../models/teacherModel.js"
import Post from "../models/postmodel.js" 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 



export const uploadProfilePhoto = async (req, res) => {
const userId = req.user.id;
const role = req.user.role;
try {

if (!req.file) {
return res.status(400).json({ message: "No file uploaded" });
}
const updatedUser = await user.findByIdAndUpdate(
userId,
{ photo: req.file.filename },
{ new: true }
);

if (!updatedUser) {
return res.status(404).json({ message: "User not found" });
}
let updatedProfile;
if (role === "Student") {
updatedProfile = await Student.findOneAndUpdate(
{ studentId: userId },
{ photo: req.file.filename },
{ new: true }
);

}
else if (role === "Teacher") {

updatedProfile = await Teacher.findOneAndUpdate(
{ teacherId: userId },
{ photo: req.file.filename },
{ new: true }
);

}

if (!updatedProfile) {
return res.status(404).json({ message: "Profile not found" });
}

res.status(200).json({
message: "Profile photo updated successfully",
user: updatedUser,
profile: updatedProfile
});

} catch (error) {

res.status(500).json({ message: error.message });

}

};
//updaate student profile
export const updateStudentProfile= async (req,res)=>{
    
    try {
        const studentId =req.user.id;
    const {  name, email,subject,location,grade,phoneNo } = req.body;
    console.log(name, email,subject,location,grade,phoneNo);
if (!subject || !name || !email || !location || !grade || !phoneNo) {
            return res.status(400).json({ message: "All fields are required" });
        }
        //updating user detail
       await user.findByIdAndUpdate(studentId,{
        name,
        email
       })
       //updating student detail
        await Student.findOneAndUpdate(
        {studentId:studentId},
        {
         subject,
         location,
         grade,
         phoneNo,
        }
       )
       res.status(200).json({message:"Profile updated successfully"});
    } catch (error) {
      res.status(500).json({ message: error.message });  
    }
}
export const getStudentProfile= async (req,res)=>{
    try{

   const student = await Student
.findOne({ studentId: req.user.id })
.populate("studentId");

   res.status(200).json(student);

 }catch(error){
   res.status(500).json({message:error.message});
 }
}
//post 
export const post= async (req,res)=>{
    try{
const userId =req.user.id;
const {objective,content}=req.body;
if (!objective||!content){
return res.status(400).json({ message: "All fields are required" });
} 
   const post = await Post.create({
   userId:userId,
   objective:objective,
   content:content,
   });
   console.log(post);
   res.status(201).json(post);

 }catch(error){
   res.status(500).json({message:error.message});
 }
}
export const getpost= async (req,res)=>{
    try{
const userId =req.user.id;

if (!userId){
return res.status(400).json({ message: "user not exist" });
}
   const post = await Post.find({userId:userId});
   res.status(200).json(post);

 }catch(error){
   res.status(500).json({message:error.message});
 }
}
 export const deletePost = async (req,res)=>{
    try{

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({message:"post deleted"});

    }catch(err){
        res.status(500).json(err);
    }
}

 