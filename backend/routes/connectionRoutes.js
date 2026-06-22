import express from "express"
import {createUser,getUserbyEmail,login,ok} from "../controllers/userControllers.js"
import {uploadProfilePhoto,updateStudentProfile,getStudentProfile,post,getpost,deletePost} from "../controllers/studentControllers.js"
import{islogedIn,onlyStudent} from "../middleware/authentication.js"
import upload from "../middleware/upload.js"
import { sendConnectionRequest, acceptRequest, declineRequest, getConnections,getConnectionsRequest } from "../controllers/connectionControllers.js";
const router =express.Router(); 
router.post("/send", islogedIn, sendConnectionRequest); 
router.put("/accept/:id", islogedIn, acceptRequest);
router.put("/reject/:id", islogedIn, declineRequest);
router.get("/", islogedIn, getConnections);
router.get("/request", islogedIn,getConnectionsRequest);
export default router;