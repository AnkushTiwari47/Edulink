import { Server } from "socket.io";

const onlineUsers = new Map();

export default function initSocket(server){

const io = new Server(server,{
cors:{
origin:"*"
}
});

io.on("connection",(socket)=>{

console.log("User connected:",socket.id);

socket.on("register",(userId)=>{

onlineUsers.set(userId,socket.id);
 io.emit("onlineUsers", Array.from(onlineUsers.keys()));

});

socket.on("typing", ({ sender, receiver }) => {

    const receiverSocket = onlineUsers.get(receiver);

    if (receiverSocket) {
        io.to(receiverSocket).emit("typing", { sender });
    }

});
socket.on("sendMessage",(data)=>{

const receiverSocket = onlineUsers.get(data.receiver);

if(receiverSocket){

io.to(receiverSocket).emit("receiveMessage",data);

}

});

socket.on("disconnect",()=>{

for(const [userId,socketId] of onlineUsers.entries()){

if(socketId === socket.id){

onlineUsers.delete(userId);

}

}
 io.emit("onlineUsers", Array.from(onlineUsers.keys()));
});

});

}