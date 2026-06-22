import express from "express"
import {createUser,getUserbyEmail,login,ok,fetchTeacher,searchTeacher} from "../controllers/userControllers.js"
import{islogedIn} from "../middleware/authentication.js"
const router =express.Router();
router.get("/check",islogedIn,ok)
router.post("/register",createUser)
router.post("/login",login,)
router.get("/findbyemail", getUserbyEmail);
router.get("/fetchTeacher", fetchTeacher);
router.get("/searchTeacher", searchTeacher);
export default router