//authentication middleware
import jwt from "jsonwebtoken";
 export const islogedIn = async (req,res,next)=>{
    try {
       console.log("HEADER:",req.headers.authorization)
       const authHeader=req.headers.authorization
    if (!authHeader){
     return   res.status(401).json({message:"not loged in !"})

    }
    if (!authHeader.startsWith("Bearer ")){
     return res.status(401).json({message:"invalid tokens!"})
    }
    const token = authHeader.split(" ")[1];
    const decoded =jwt.verify(token,process.env.my_secreytKe);
    req.user=decoded
    next();

    } catch (error) {
        console.log("JWT ERROR:", error.message);
       res.status(401).json({message:error.message});
    }
 };
//accesed by only teachers
export const onlyTeacher = async(req,res,next)=>{
    if (req.user.role !="Teacher"){
        return res.status(401).json({message:"access denied!"});
    }
    next();
};
//accesed by only student
export const onlyStudent = async(req,res,next)=>{
    if (req.user.role !="Student"){
        return res.status(401).json({message:"access denied!"});
    }
    next();
};