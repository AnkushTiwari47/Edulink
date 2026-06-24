import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // This calculates the absolute path to your backend/uploads/profile folder
        // adjustments: If this config file is inside a subfolder (like 'config/' or 'middleware/'), 
        // use "../uploads/profile" instead of "./uploads/profile" to step out first.
        const absolutePath = path.resolve(__dirname, "../uploads/profile");
        
        cb(null, absolutePath);  
    },
    filename: function(req, file, cb) {
        const uniquename = Date.now() + "-" + file.originalname;
        cb(null, uniquename);
    }
});

const upload = multer({ storage: storage });
export default upload;