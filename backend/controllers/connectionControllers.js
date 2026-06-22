import Connection from "../models/connectionModel.js";

export const sendConnectionRequest = async (req,res)=>{

try{

const {receiverId} = req.body;

const existing = await Connection.findOne({
$or: [
{ sender: req.user.id, receiver: receiverId },
{ sender: receiverId, receiver: req.user.id }
]
});

if(existing){
return res.status(400).json({message:"Request already sent"});
}

const request = await Connection.create({
sender:req.user.id,
receiver:receiverId
});

res.json(request);
console.log(request);

}catch(err){
res.status(500).json({message:err.message});
}

}
//accept connection request===========================
export const acceptRequest = async (req,res)=>{

const request = await Connection.findByIdAndUpdate(
req.params.id,
{status:"accepted"},
{new:true}
)

res.json(request)

}
//decline connection request=============================
export const declineRequest = async (req,res)=>{

const request = await Connection.findByIdAndUpdate(
req.params.id,
{status:"rejected"},
{new:true}
)

res.json(request)

}
// get all the accepted connection====================================
export const getConnections = async (req, res) => {
try { 

const connections = await Connection.find({
status: "accepted",
$or: [
{ sender: req.user.id }, 
{ receiver: req.user.id }
]
}) 
.populate("sender", "name photo role")
.populate("receiver", "name photo role");

res.status(200).json(connections ,req.user.id); 

} catch (error) {
res.status(500).json({ message: error.message });
}
};
// get all the requested connection====================================
export const getConnectionsRequest = async (req, res) => {

try {

const connections = await Connection.find({
status: "pending",
receiver: req.user.id 

}).populate("sender", "name photo role")
if (connections.length === 0) {
    return res.status(404).json({ message: "No connection requests found" });
}
res.status(200).json(connections);

} catch (error) {
res.status(500).json({ message: error.message });
}

};