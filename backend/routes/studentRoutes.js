import express from "express"
import {createUser,getUserbyEmail,login,ok} from "../controllers/userControllers.js"
import {uploadProfilePhoto,updateStudentProfile,getStudentProfile,post,getpost,deletePost} from "../controllers/studentControllers.js"
import{islogedIn,onlyStudent} from "../middleware/authentication.js"
import upload from "../middleware/upload.js"
const router =express.Router();
router.get("/student/profile",islogedIn,onlyStudent,getStudentProfile);
router.put("/student/profile/photo",islogedIn,onlyStudent,upload.single("photo"),uploadProfilePhoto)
router.put("/student/updateprofile",islogedIn,onlyStudent,updateStudentProfile)
router.get("/student/post", islogedIn,onlyStudent,getpost)
router.post("/student/post",islogedIn,onlyStudent,post)
router.delete("/student/post/:id",islogedIn,onlyStudent,deletePost)
//router.get("/student/post:id",islogedIn,onlyStudent,post)
export default router