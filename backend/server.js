import express from "express";
import connectDB from "./config/db.js";
import studentRoute from "./routes/studentRoutes.js";
import teacherRoute from "./routes/teacherRoutes.js";
import userRoute from "./routes/userRoutes.js";
import connectionRoute from "./routes/connectionRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import dotenv from "dotenv";
import http from "http";
import initSocket from "./socket.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

connectDB();

app.use("/user", userRoute);
app.use("/user", studentRoute);
app.use("/user", teacherRoute);
app.use("/connections", connectionRoute);
app.use("/chat", chatRoutes); 
 
const server = http.createServer(app);

initSocket(server);   

server.listen(process.env.port || 3000, ()=>{  
console.log("Server running on port 3000");
});