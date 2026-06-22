import multer from "multer";
const storage=multer.diskStorage({
destination: function(req,file,cb){
    cb(null,"uploads/profile")  
},
filename:function(req,file,cb){
    const uniquename=Date.now()+"-"+file.originalname;
    cb(null,uniquename)
}
})
const upload =multer({storage:storage});
export default upload;