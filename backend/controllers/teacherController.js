import user from "../models/userModel.js"
import Student from "../models/studentModel.js"
import Teacher from "../models/teacherModel.js"
import Post from "../models/postmodel.js"
export const getStudentpost= async(req,res)=>{
try{
   const post = await Post.find();
   res.status(200).json(post);

 }catch(error){
   res.status(500).json({message:error.message});
 }
}
//update teacher profile
export const updateTeacherProfile= async (req,res)=>{
     
    try {
        const teacherId =req.user.id;
    const {  name, email,subject,location,grade,phoneNo,qualifications,bio,college} = req.body;
    /*console.log(name, email,subject,location,grade,phoneNo,qualifications,bio,college);*/
if (!subject || !name || !email || !location || !grade || !phoneNo||!bio||!college||!qualifications) {
            return res.status(400).json({ message: "All fields are required" });
        }
        //updating user detail
       await user.findByIdAndUpdate(teacherId,{
        name,
        email
       })
       //updating student detail
        await Teacher.findOneAndUpdate(
        {teacherId:teacherId},
        {
         subject,
         location,
         grade,
         phoneNo,
         qualifications,
         bio,
         college

        }
       )
       res.status(200).json({message:"Profile updated successfully"});
    } catch (error) {
      res.status(500).json({ message: error.message });  
    }
}                                       
export const getTeacherProfile= async (req,res)=>{
    try {
        const userId=req.user.id;
        const teacher = await Teacher.findOne({teacherId:userId})
        .populate("teacherId");
        res.status(200).json(teacher);
    } catch (error) {
      res.status(500).json({message:error.message})
    }
}