import user from "../models/userModel.js"
import Student from "../models/studentModel.js"
import Teacher from "../models/teacherModel.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 

export const  createUser = async (req,res)=>{
    try {//hash the password
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        const { name, email, password,role } = req.body;
        //  validation
        if ( !name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // check existing user
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const users= await user.create({
            
            name,
            email,
            password:hashedPassword,
            role
        }

        );
        if (role ==="Student"){
            const Students = await Student.create({
              studentId:users._id
            });
        }
        else if (role ==="Teacher"){
            const Teachers =await Teacher.create({
                teacherId:users._id  
            })
        }
        //  remove password
        const userWithoutPassword = users.toObject();
        delete userWithoutPassword.password;
        //  send safe response
        res.status(201).json(userWithoutPassword);
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
export const  getUserbyEmail = async (req,res)=>{
    try {
        const users= await user.findOne({ email:req.body.email});
    
    if (!users) {
           return  res.status(404).json({ message: "User not found" });
        }
        res.status(201).json(users)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
//login
export const login = async(req,res)=>{
try {
    const {email,password}=req.body
    //checking wether user exist or not
    const foundUser= await user.findOne({email}).select("+password");
    if (!foundUser){
        return res.status(401).json({message:"invalid email or password"})
    }
    //validating password
    const matchpassword = await bcrypt.compare(password,foundUser.password);
if (!matchpassword){
    return res.status(401).json({message:"invalid email or password"})
    
}
//generating tokens
    const token =jwt.sign({
   id: foundUser._id,role: foundUser.role},
   process.env.my_secreytKe,
   {expiresIn: "1d"}
)
//sending response after removing password
const sendData=foundUser.toObject();
    delete sendData.password
    res.status(200).json({message:"login successful",token,user:sendData})
} catch (error) {
  res.status(500).json({message:error.message})  
}
}
export const ok = (req,res)=>{
res.status(200).json({loggedIn:true,
    user:req.user
})
}
//=======================fetching teacher================
export const fetchTeacher=async (req,res)=>{
try {
    const page=parseInt(req.query.page)||1;
    const limit=parseInt(req.query.limit)||10;
    const skip=(page-1)*limit;
   const teachers= await Teacher.find() 
   .skip(skip) 
   .limit(limit)
   .populate("teacherId","name ")
   res.status(200).json(teachers);
} catch (error) {
    res.status(500).json({message:error.message})
}
}
export const searchTeacher = async (req, res) => {
  try {
    const { name, subject, location, page = 1, limit = 6 } = req.query;

    const skip = (page - 1) * limit;

    let matchStage = {};

    if (subject) {
      matchStage.subject = { $in: [new RegExp(subject, "i")] };
    }

    if (location) {
      matchStage.location = { $regex: location, $options: "i" };
    }
 
    const pipeline = [
      { $match: matchStage },

      {
        $lookup: {
          from: "users",
          localField: "teacherId",
          foreignField: "_id",
          as: "teacherId"
        }
      },

      { $unwind: "$teacherId" },

      ...(name
        ? [{
            $match: {
              "teacherId.name": { $regex: name, $options: "i" }
            }
          }]
        : []),
    {
    $project: {
      // teacher fields
      subject: 1,
      location: 1,
      photo: 1,
      bio: 1,
      college: 1,
      qualifications: 1,
      grade: 1,

      // only required user fields
      "teacherId._id": 1,
      "teacherId.name": 1

      //  password NOT included
      // email NOT included
    }
  }
    ];

    const total = await Teacher.aggregate(pipeline);
    
    const teachers = await Teacher.aggregate([
      ...pipeline,
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      teachers,
      totalPages: Math.ceil(total.length / limit)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};