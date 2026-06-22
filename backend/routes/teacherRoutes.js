
import{getStudentpost,updateTeacherProfile,getTeacherProfile} from "../controllers/teacherController.js"
import express from "express"
const router=express.Router();
import{islogedIn,onlyTeacher} from "../middleware/authentication.js"
import {uploadProfilePhoto} from "../controllers/studentControllers.js"
import upload from "../middleware/upload.js"
router.get("/teacher/tuitionPost",islogedIn,onlyTeacher,getStudentpost)
router.put("/teacher/updateprofile",islogedIn,onlyTeacher,updateTeacherProfile)
router.put("/teacher/profile/photo",islogedIn,onlyTeacher,upload.single("photo"),uploadProfilePhoto)
router.get("/teacher/profile",islogedIn,onlyTeacher,getTeacherProfile)
export default router