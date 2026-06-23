  function chatstyle() {
    // 1. Remove any old global listeners if this function runs multiple times
    document.body.removeEventListener('click', handleGlobalChatClicks);
    
    // 2. Attach the global listener
    document.body.addEventListener('click', handleGlobalChatClicks);
    console.log("Global event delegation initialized.");
}

// Separate named function to handle the click delegation cleanly
function handleGlobalChatClicks(e) {
    // Find the closest parent that matches the target classes
    const contactItem = e.target.closest('.conversation-item');
    const backBtn = e.target.closest('.back-btn');
    const container = document.querySelector('.edulink-chat-container');

    // Handle Contact Item Click
    if (contactItem) {
        e.preventDefault();
        console.log(" Click captured successfully via delegation on:", contactItem);
        
        
        if (container) {
            
            container.classList.add('show-chat');
        } else {
            console.error("Could not find element '.edulink-chat-container' in the DOM.");
        }
    }

    // Handle Mobile Back Button Click
    if (backBtn) {
        e.preventDefault();
        console.log("Back button clicked!");
        if (container) {
            container.classList.remove('show-chat');
        }
    }
}
  
  async function  chathtml(){
    document.getElementById("main-content").addEventListener("click",async(e)=>{
        if (e.target.matches(".chatbar")){ 
      await  loadInteriorChatComponent("/component/student/chat.html");
        const container = document.querySelector(".container");
container.classList.add("chat-page");
        initChat();
    }
    })
    
 }
 
 
 
 
 function timeAgo(dateString){

const now = new Date();
const past = new Date(dateString);

const seconds = Math.floor((now - past) / 1000);

const minutes = Math.floor(seconds / 60);
const hours = Math.floor(seconds / 3600);
const days = Math.floor(seconds / 86400);
const months = Math.floor(seconds / 2592000);
const years = Math.floor(seconds / 31536000);

if(seconds < 60) return `${seconds} seconds ago`;

if(minutes < 60) return `${minutes} minutes ago`;

if(hours < 24) return `${hours} hours ago`;

if(days < 30) return `${days} days ago`;

if(months < 12) return `${months} months ago`;

return `${years} years ago`;

}
//sending connection request
const sendConnectionRequest =async (receiverId)=>{
    const token=localStorage.getItem("token");
    if(!token){
        alert("Please login first");
        return
    }
    
    const response=await fetch("/connections/send",{
        method:"POST",
     headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
     },
     body:JSON.stringify({receiverId })
    });
    const data=response.json()
    console.log(data);
    if (response.ok){
        alert("request sent");
    }else{alert("request already sent")}
    document.getElementById("post-view-overlay").style.display="none";
}
//geting all connection request
const getConnectionsRequest =async ()=>{
    const token=localStorage.getItem("token");
    if(!token){
        alert("Please login first");
        return
    }
    
    const response=await fetch("/connections/request",{
        method:"GET",
     headers:{
        Authorization:`Bearer ${token}`
     },
    });
    const data= await response.json()
    if (!response.ok){
   document.querySelector(".request-grid").innerHTML = `<p>🔴 connection request not found!</p>
   <p>🔥 try making new connection</p>
   <p>⚡explore the tutors and students near you</p>`;
   return;
}
console.log(data);
    let html="";
    data.forEach(p=>{
        html+=`<div class="request-card">
                    <div class="card-header">
                        <img src="/uploads/profile/${p.sender.photo}" alt="Aisha">
                        <div class="header-text">
                            <strong><h2>${p.sender.name}</h2></strong>
                            <p>Sent: ${timeAgo(p.createdAt)}  &nbsp;&nbsp;</p>
                        </div>
                    </div>
                    <p class="request-note">Would like to connect...</p>
                    <div class="card-actions">
                        <button class="btn-accept" data-id="${p._id}">ACCEPT</button>
                        <button class="btn-decline"data-id="${p._id}">DECLINE</button>
                    </div>
                </div>`
    })
document.querySelector(".request-grid").innerHTML=html;
}
//geting all connection 
const getConnections =async ()=>{
    const token=localStorage.getItem("token");
    if(!token){
        alert("Please login first");
        return
    }
    
    const response=await fetch("/connections/",{
        method:"GET",
     headers:{
        Authorization:`Bearer ${token}`
     },
    });
    const data= await response.json()
    console.log(data);
    const currentUserId = localStorage.getItem("userId");
    let html="";
    data.forEach(p=>{
        const otherUser=
        p.sender._id===currentUserId?p.receiver:p.sender;
        html+=`
                <div class="conn-item">
                    <img src="/uploads/profile/${otherUser.photo}" alt="Aisha">
                    <div class="conn-info">
                        <strong><h2>${otherUser.name}</h2></strong>
                        <p class="blue">${otherUser.role}</p>
                    </div>
                    <button class="btn-msg-small" data-id="${otherUser._id}">Message</button>
                </div>`
    })
  document.querySelector(".connection-list").innerHTML=html;
} 
getConnections();

//accepting request
const acceptConnectionRequest =async (id)=>{
    const token=localStorage.getItem("token");
    if(!token){
        alert("Please login first");
        return
    }
    const response=await fetch(`/connections/accept/${id}`,{
        method:"PUT",
     headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
     },
    });
    const data= await response.json()
    console.log(data);
    if (response.ok){
        alert("request accepted");
        getConnectionsRequest();
        getConnections();
    }
}
//declining request
const declineConnectionRequest =async (id)=>{
    const token=localStorage.getItem("token");
    if(!token){
        alert("Please login first");
        return
    }
    
    const response=await fetch(`/connections/reject/${id}`,{
        method:"PUT",
     headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
     },
    });
    const data= await response.json()
    console.log(data);
    if (response.OK){
        alert("request declined");
        getConnectionsRequest();
        getConnections();
    }
}


//clicking on connection to see connection list
document.addEventListener("click", async (e) => {

    if (e.target.closest(".Connectionbar")) {

        

        await loadInteriorComponent("/component/student/chatConnection.html");

        getConnectionsRequest();
        getConnections();

        activebar();
        chathtml();
    }

});

//showing request

//loading css for diffrent role dynamicaly
function loadCSS(path){

const link = document.createElement("link");

link.rel = "stylesheet";  

link.href = path;

document.head.appendChild(link);

}

//load profile
const loadProfile = async (path) => {

const token = localStorage.getItem("token");

if(!token) return;

try{

const response = await fetch(path,{
headers:{
Authorization:`Bearer ${token}`
}
});

const student = await response.json();
return student;

} catch(error){
console.error(error);
}

};

//show profile
const showprofile=async (student)=>{ 
    document.getElementById("profile-image-container").src =`/uploads/profile/${student.photo}`;
    document.getElementById("userid").value=student.studentId.userId;
    document.getElementById("name").value=student.studentId.name;
    document.getElementById("email").value=student.studentId.email;
    document.getElementById("subject").value=student.subject.join(",");
    document.getElementById("location").innerText=student.location;
    document.getElementById("class").value=student.grade;
}
//showEditProfile
const showeditprofile=async (student)=>{
    document.getElementById("profile-name").innerText=student.studentId.name;
    document.getElementById("profile-location").innerText=student.location;
    document.getElementById("profile-pic-container").src =`/uploads/profile/${student.photo}`;
    document.getElementById("user-name").innerText=student.studentId.name;
    document.getElementById("Name").value=student.studentId.name;
    document.getElementById("Email").value=student.studentId.email;
    document.getElementById("Phone").value=student.phoneNo;
    document.getElementById("Subject").value=student.subject.join(",");
    document.getElementById("grade").value=student.grade;
    document.getElementById("Location").value=student.location;
}

//for deciding student or teacher profile
async function loadstudentComponent(path){

const res = await fetch(path);

const html = await res.text();

document.getElementById("main-container").innerHTML = html;
//after load all button work
const dashboardBtn = document.getElementById("dashboard");
const postBtn = document.getElementById("Your-post");
const editBtn = document.getElementById("Edit-Profile");
const myTeachersBtn = document.getElementById("My-Teachers");
const myCourseBtn = document.getElementById("My-Courses");
const chatConnection = document.getElementById("chat-connection");

const logout = document.getElementById("logout");
console.log(logout);
if(logout){
logout.addEventListener("click",async()=>{
    alert("are you sure to logout!");
 localStorage.removeItem("token")
 window.location.href="../index.html"
});
}
if(postBtn){
postBtn.addEventListener("click",async()=>{
 await loadInteriorComponent("/component/student/studentpost.html");
getpost();
});
}
if(editBtn){
editBtn.addEventListener("click",async()=> {
loadInteriorComponent("/component/student/studentEditprofile.html");
const student =await loadProfile("/user/student/profile");
showeditprofile(student);
});
}
if(myTeachersBtn){
myTeachersBtn.addEventListener("click",()=>{
loadInteriorComponent("/component/student/.html");
});
}

if(dashboardBtn){
dashboardBtn.addEventListener("click", async ()=>{
loadInteriorComponent("/component/student/StudentDashboard.html");
const student =await loadProfile("/user/student/profile");
showprofile(student);

});
}
if(chatConnection){
chatConnection.addEventListener("click",async()=>{
 await loadInteriorComponent("/component/student/chatConnection.html");
getConnectionsRequest();
getConnections();
activebar();
chathtml();
});
}

}
//for internal navigation in student profile
async function loadInteriorComponent(path){
console.log("post clicked");
const res = await fetch(path);
const html = await res.text();
document.getElementById("main-content").innerHTML = html;


}
//checking user role
const checkRole = async ()=>{

    const token = localStorage.getItem("token");
    console.log(token)
    if (!token){
        return
    }
    try {
        const res= await fetch("/user/check",{
        headers:{
            Authorization:`Bearer ${token}`
        }
       })
    const data = await res.json();
    const role = data.user.role
    const userId=data.user.id;
    localStorage.setItem("userId",userId)
    console.log(data.user);

    if (role==="Student"){
 await loadstudentComponent("/component/student/StudentAcount.html");
const student =await loadProfile("/user/student/profile");
//showprofile(student);
getConnectionsRequest();
getConnections();
activebar();
activemainbarstudent();
chathtml();
    }
    else if(role==="Teacher"){
        loadCSS("../css/teacherAccount.css");
        loadteacherComponent("/component/teacher/teacherAccount.html");
        const teacher =await loadProfile("/user/teacher/profile");
        //console.log(teacher);
        document.getElementById("greetname").innerText=teacher.teacherId.name;
         document.getElementById("profile-pic").src =`/uploads/profile/${teacher.photo}`;
         activebar();
         activemainbar();
         chathtml();
    }

    } catch (error) {
        {message:error.message}
    }
}
document.addEventListener("DOMContentLoaded",checkRole)
console.log(document.getElementById("main-container"))
//upload function
const uploadphoto = async (path)=>{
    const token=localStorage.getItem("token");
    if(!token){
        alert("Please login first");
        return
    }
    const fileInput = document.getElementById("photoInput");
    const formData=new FormData();
    formData.append("photo",fileInput.files[0]);
    if (!fileInput.files[0]){
        alert("no file chosen!")
        return
    }


    try {
       const response =await fetch(path,{
        method:"PUT",
        headers:{
            Authorization:`Bearer ${token}`
        },

        body:formData
       }) 
       const data = await response.json();
       console.log(data);
       if(!response.ok){
            alert(data.message || "Upload failed");
            return;
        }
       return response.status;
    } catch (error) {
        console.error(error.message);
    }
 const student =await loadProfile("/user/student/profile");
 showeditprofile(student);

}
//save changes
const saveChanges =async ()=>{
    const token=localStorage.getItem("token");
    if(!token){
        alert("Please login first");
        return
    }
    const   name=document.getElementById("Name").value;
      const  email=document.getElementById("Email").value;
       const subject=document.getElementById("Subject").value.split(",");
       const location=document.getElementById("Location").value;
       const grade=document.getElementById("grade").value;
       const phoneNo=document.getElementById("Phone").value;
       if (!name||!email||!subject||!location||!grade||!phoneNo){
        alert("all field are required");
        return
       }
    const givenData={
        
        name:name,
        email:email,
        subject:subject,
        location:location,
        grade:grade,
        phoneNo:phoneNo,
    }
     
    console.log(givenData);
   try {
        const response = await fetch("/user/student/updateprofile",{
          method:"PUT",
          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
          } ,
          body:JSON.stringify(givenData)
        })
        const data=await response.json()
        console.log(data);
        //clearing value
        document.getElementById("Name").value=""
        document.getElementById("Email").value=""
        document.getElementById("Subject").value=""
        document.getElementById("Location").value=""
        document.getElementById("grade").value=""
        document.getElementById("Phone").value=""
        return response.status;
    } catch (error) {
        console.error(error.message);
    }
    //clearing value
        document.getElementById("Name").value=""
        document.getElementById("Email").value=""
        document.getElementById("Subject").value=""
        document.getElementById("Location").value=""
        document.getElementById("grade").value=""
        document.getElementById("Phone").value=""
        const teacher =await loadProfile("/user/teacher/profile");
        showTeachereditprofile(teacher);
        
}
// create post 
const post =async ()=>{
    const token=localStorage.getItem("token");
    if(!token){
        alert("login first");
        return
    }
    const objective =document.getElementById("objective").value;
    const content =document.getElementById("postdetail").value
    if(!objective ||!content){alert("all field are mandatory");
        return
    }
    const givenData ={
        objective:objective,
        content:content
    }
    
    try {
        const response = await fetch("/user/student/post",{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
          } ,
          body:JSON.stringify(givenData)
        })
        const data=await response.json()
         document.getElementById("objective").value=""
   document.getElementById("postdetail").value=""
   getpost();
        return response.status; 
        
        
    } catch (error) {
        console.error(error.message);
    }
   document.getElementById("objective").value=""
   document.getElementById("postdetail").value=""
}
//get your all post
const getpost =async ()=>{
    const token=localStorage.getItem("token");
    if(!token){
        alert("login first");
        return
    }
    try {
        const response = await fetch("/user/student/post",{
          method:"GET",
          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
          } 
        })
        const data= await response.json()
        console.log(data);
        let html=""
        data.reverse().forEach(post => {
            html+=`<div class="post-item" data-id="${post._id}">
                    <div class="post-icon user-icon">👤</div>
                    <div class="post-details">
                        <strong>${post.objective}</strong>
                        <p>${post.content}</p>
                         <p>Posted: ${timeAgo(post.createdAt)} ago &nbsp;&nbsp;<button   class="view-post-btn">view</button> </p>
                    </div>
                </div>`
        });
        document.querySelector(".post-item-container").innerHTML=html;
                
        
    } catch (error) {
        console.error(error.message);
    }
   
}
//deletepost
const deletePost = async (postId) => {

    const token = localStorage.getItem("token");

    const response = await fetch(`/user/student/post/${postId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
document.getElementById("post-view-overlay").style.display="none";
    if(response.ok){
        alert("Post deleted");
        getpost(); // reload posts
    }

};
//upload photo on profile

document.getElementById("main-container").addEventListener("click", async (e)=>{
    

    if (e.target.matches(".update-photo-btn")){
        const status = await uploadphoto("/user/student/profile/photo");
        if (status === 200){ alert("photo uploaded");}
    }

    if (e.target.matches(".save-changes-btn")){
        const status = await saveChanges();
        if (status === 200){alert("changes saved successfully");}
    }
    if(e.target.classList.contains("btn-accept")){
    const id = e.target.dataset.id;
    acceptConnectionRequest(id);

    }
    if(e.target.classList.contains("btn-decline")){
    const id = e.target.dataset.id;
    declineConnectionRequest(id);

    }

    if (e.target.matches("#postbtn")){
        const status = await post();
        if (status === 201){ alert("post created");}
    }
    if(e.target.closest(".view-post-btn")){

const btn = e.target.closest(".view-post-btn");
const postItem = btn.closest(".post-item");

const objective = postItem.querySelector("strong").innerText;
const content = postItem.querySelector("p").innerText;
const postId = postItem.dataset.id;

const overlay = document.getElementById("post-view-overlay");

document.getElementById("view-objective").innerText = objective;
document.getElementById("view-content").innerText = content;

overlay.dataset.id = postId;
overlay.style.display = "flex";

}
if(e.target.matches(".delete-post-btn")){

const overlay = document.getElementById("post-view-overlay");
const postId = overlay.dataset.id;

deletePost(postId);

}
if(e.target.matches(".close-view")){
document.getElementById("post-view-overlay").style.display = "none";
}
});
//=====================teacher javascript logic==========================================================
function showTeachereditprofile(teacher){
    document.getElementById("avatar").src=`/uploads/profile/${teacher.photo}`;
    document.getElementById("Name").value=teacher.teacherId.name;
      document.getElementById("Email").value=teacher.teacherId.email;
    document.getElementById("Subject").value=teacher.subject;
    document.getElementById("Location").value=teacher.location;
    document.getElementById("grade").value=teacher.grade;
    document.getElementById("Phone").value=teacher.phoneNo;
       document.getElementById("Qualifications").value=teacher.qualifications;
       document.getElementById("college").value=teacher.college;
       document.getElementById("Bio").value=teacher.bio;
}
async function loadteacherComponent(path){

const res = await fetch(path);

const html = await res.text();

document.getElementById("main-container").innerHTML = html;
//after load all button work
const dashboardBtn = document.getElementById("dashboard");
const postBtn = document.getElementById("Your-post");
const editBtn = document.getElementById("Edit-Profile");
const myTeachersBtn = document.getElementById("your-students");
const helpandsupportbtn = document.getElementById("helpandsupport");
const logout = document.getElementById("logout");
const chatConnection = document.getElementById("chat-connection");
getStudentpost();
const container = document.querySelector(".post-item-container");
if(container){
container.addEventListener("click", (e)=>{
console.log("clicked", e.target);
//============for viewing single post===========

if(e.target.closest(".view-post-btn")){
const postItem = e.target.closest(".post-item");
const objective = postItem.querySelector("strong").innerText;
const postuserId = postItem.dataset.id;
const content = postItem.querySelectorAll("p")[0].innerText;
document.getElementById("view-objective").innerText = objective;
document.getElementById("view-content").innerText = content;
document.getElementById("post-view-overlay").dataset.id = postuserId;
document.getElementById("post-view-overlay").style.display = "flex";
}
});
}
document.querySelector(".close-view").addEventListener("click",()=>{
    document.getElementById("post-view-overlay").style.display="none";

}); 
const overlay = document.getElementById("post-view-overlay");

overlay.addEventListener("click", (e) => {

    if(e.target === overlay){
        overlay.style.display = "none";
    }

});

    
//============================================================
if(postBtn){  
postBtn.addEventListener("click",()=>{
//loadInteriorComponent("/component/student/studentpost.html");
//getpost();
});
}
if(logout){
logout.addEventListener("click",async()=> {
    localStorage.removeItem("token")
    window.location.href="../index.html"
alert("loged out!");
});
}
if(editBtn){
editBtn.addEventListener("click",async()=> {
loadInteriorteacherComponent("/component/teacher/teacherEditprofile.html");
const teacher =await loadProfile("/user/teacher/profile");
showTeachereditprofile(teacher);
});
}
if(myTeachersBtn){
postBtn.addEventListener("click",()=>{
//loadInteriorComponent("/component/student/studentpost.html");
});
}

if(dashboardBtn){
dashboardBtn.addEventListener("click", async ()=>{
loadInteriorteacherComponent("/component/teacher/teacherdashboard.html");
getStudentpost();
const teacher =await loadProfile("/user/teacher/profile");
        //console.log(teacher);
        document.getElementById("greetname").innerText=teacher.teacherId.name;
         document.getElementById("profile-pic").src =`/uploads/profile/${teacher.photo}`;

});
}
if(chatConnection){
    
chatConnection.addEventListener("click",async()=>{
 await loadInteriorComponent("/component/teacher/chatConnection.html");
 getConnectionsRequest();
 getConnections();
activebar();
chathtml();

});
}

//============================================================
if(postBtn){
postBtn.addEventListener("click",()=>{
//loadInteriorComponent("/component/student/studentpost.html");
//getpost();
});
}
if(logout){
logout.addEventListener("click",async()=> {
    localStorage.removeItem("token")
    window.location.href="../index.html"
alert("loged out!");
});
}
if(editBtn){
editBtn.addEventListener("click",async()=> {
loadInteriorteacherComponent("/component/teacher/teacherEditprofile.html");
const teacher =await loadProfile("/user/teacher/profile");
showTeachereditprofile(teacher);
});
}
if(myTeachersBtn){
postBtn.addEventListener("click",()=>{
//loadInteriorComponent("/component/student/studentpost.html");
});
}

if(dashboardBtn){
dashboardBtn.addEventListener("click", async ()=>{
loadInteriorteacherComponent("/component/teacher/teacherdashboard.html");
getStudentpost();
const teacher =await loadProfile("/user/teacher/profile");
        //console.log(teacher);
        document.getElementById("greetname").innerText=teacher.teacherId.name;
         document.getElementById("profile-pic").src =`/uploads/profile/${teacher.photo}`;

});
}
if(chatConnection){
   
chatConnection.addEventListener("click",async()=>{
 await loadInteriorComponent("/component/teacher/chatConnection.html");
getConnectionsRequest();
getConnections();
activebar();
chathtml();

});
}


//============================================================
if(postBtn){
postBtn.addEventListener("click",()=>{
//loadInteriorComponent("/component/student/studentpost.html");
//getpost();
});
}
if(logout){
logout.addEventListener("click",async()=> {
    localStorage.removeItem("token")
    window.location.href="../index.html"
alert("loged out!");
});
}
if(editBtn){
editBtn.addEventListener("click",async()=> {
loadInteriorteacherComponent("/component/teacher/teacherEditprofile.html");
const teacher =await loadProfile("/user/teacher/profile");
showTeachereditprofile(teacher);
});
}
if(myTeachersBtn){
postBtn.addEventListener("click",()=>{
//loadInteriorComponent("/component/student/studentpost.html");
});
}

if(dashboardBtn){
dashboardBtn.addEventListener("click", async ()=>{
loadInteriorteacherComponent("/component/teacher/teacherdashboard.html");
getStudentpost();
const teacher =await loadProfile("/user/teacher/profile");
        //console.log(teacher);
        document.getElementById("greetname").innerText=teacher.teacherId.name;
         document.getElementById("profile-pic").src =`/uploads/profile/${teacher.photo}`;

});
}
if(chatConnection){
   
chatConnection.addEventListener("click",async()=>{
 await loadInteriorComponent("/component/teacher/chatConnection.html");
getConnectionsRequest();
getConnections();
activebar();
chathtml();

});
}

}
async function loadInteriorteacherComponent(path){
const res = await fetch(path);
const html = await res.text();
  document.getElementById("main-content").innerHTML = html;

 
}
async function loadInteriorChatComponent(path){
const res = await fetch(path);
const html = await res.text();
document.getElementById("chat--container").innerHTML = html;


}
const getStudentpost =async ()=>{
    const token=localStorage.getItem("token");
    if(!token){
        alert("login first");
        return
    }
    try {
        const response = await fetch("/user/teacher/tuitionPost",{
          method:"GET",
          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
          } 
        })
        const data= await response.json()
        console.log(data);
        let html=""
        data.reverse().forEach(post => {
            html+=`<div class="post-item" data-id="${post.userId}">
                    <div class="post-icon user-icon">👤</div>
                    <div class="post-details">
                        <strong>${post.objective}</strong>
                        <p>${post.content}</p>
                         <p>Posted: ${timeAgo(post.createdAt)} ago &nbsp;&nbsp;<button   class="view-post-btn">view</button> </p>
                    </div>
                </div>`
        });
        document.querySelector(".post-item-container").innerHTML=html;
                
        
    } catch (error) {
        console.error(error.message);
    }
   
}
//============editing teachers profile========================


//save changes
const saveTeacherChanges =async ()=>{
    const token=localStorage.getItem("token");
    if(!token){
        alert("Please login first");
        return
    }
    const   name=document.getElementById("Name").value;
      const  email=document.getElementById("Email").value;
       const subject=document.getElementById("Subject").value.split(",");
       const location=document.getElementById("Location").value;
       const grade=document.getElementById("grade").value;
       const phoneNo=document.getElementById("Phone").value;
       const qualifications=document.getElementById("Qualifications").value;
       const college=document.getElementById("college").value;
       const Bio=document.getElementById("Bio").value;
       if (!name||!email||!subject||!location||!grade||!phoneNo||!Bio||!qualifications||!college){
        alert("all field are required");
        return
       }
    const givenData={
        
        name:name,
        email:email,
        subject:subject,
        location:location,
        grade:grade,
        phoneNo:phoneNo,
        college:college,
        qualifications:qualifications,
        bio:Bio,
    }
     
    console.log(givenData);
   try {
        const response = await fetch("/user/teacher/updateprofile",{
          method:"PUT",
          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
          } ,
          body:JSON.stringify(givenData)
        })
        const data=await response.json()
        console.log(data);
        //clearing value
        document.getElementById("Name").value=""
        document.getElementById("Email").value=""
        document.getElementById("Subject").value=""
        document.getElementById("Location").value=""
        document.getElementById("grade").value=""
        document.getElementById("Phone").value=""
        document.getElementById("Qualifications").value=""
        document.getElementById("Bio").value=""
        document.getElementById("college").value=""
        return response.status;
    } catch (error) {
        console.error(error.message);
    }
    //clearing value
        document.getElementById("Name").value=""
        document.getElementById("Email").value=""
        document.getElementById("Subject").value=""
        document.getElementById("Location").value=""
        document.getElementById("grade").value="" 
        document.getElementById("Phone").value=""
        document.getElementById("Qualifications").value=""
        document.getElementById("Bio").value=""
        document.getElementById("college").value=""
        const teacher =await loadProfile("/user/teacher/profile");
        showTeachereditprofile(teacher);
        
         
}


document.getElementById("main-container").addEventListener("click", async (e)=>{
     

    if (e.target.matches(".saveTeacherChanges")){
        alert("profile edited");
        saveTeacherChanges();
        const teacher =await loadProfile("/user/teacher/profile");
        showTeachereditprofile(teacher);
        
    }
    if(e.target.matches(".uploadbtn")){
        const status = await uploadphoto("/user/teacher/profile/photo");
        if (status === 200){ alert("photo uploaded");}
        const teacher =await loadProfile("/user/teacher/profile");
        showTeachereditprofile(teacher);
    }
    if(e.target.matches(".removebtn")){ 
      const fileInput = document.getElementById("photoInput");
    fileInput.value="" 
    } 
    if(e.target.matches("#connect")){ 
        const  receiverId=document.getElementById("post-view-overlay").dataset.id;
      sendConnectionRequest(receiverId);
      
    }
 
});
function activebar(){
const navItems = document.querySelectorAll(".sub-nav li");
navItems.forEach(item => {
    item.addEventListener("click", function(){
        // remove active from all
        navItems.forEach(li => li.classList.remove("active"));
        // add active to clicked item
        this.classList.add("active");
    });
});
}

function activemainbar(){
const navItems = document.querySelectorAll(".menu a");
navItems.forEach(item => {
    item.addEventListener("click", function(){
        // remove active from all
        navItems.forEach(li => li.classList.remove("active"));
        // add active to clicked item
        this.classList.add("active");
    });
});
}
function activemainbarstudent(){
const navItems = document.querySelectorAll(".nav-links li");
navItems.forEach(item => {
    item.addEventListener("click", function(){
        // remove active from all
        navItems.forEach(li => li.classList.remove("active"));
        // add active to clicked item
        this.classList.add("active");
    });
});
}
//========chat.js========================================
// ===============================
// SOCKET SETUP (RUN ONCE)
// ===============================
const socket = io("http://localhost:3000");

const userId = localStorage.getItem("userId");

socket.on("connect", () => {
    socket.emit("register", userId);
});

// ===============================
// GLOBAL STATE
// ===============================
let currentReceiver = null;
let currentConversation = null;
let currentOtherUser = null;
function formatMessageTime(date) {
    if (!date) return "";

    const d = new Date(date);

    return d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function formatTime(date) {
    if (!date) return "";

    const d = new Date(date);

    return d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}
// ===============================
// INIT FUNCTION (CALL AFTER HTML LOAD)
// ===============================
 async function initChat(){
    
    //=======online status=================================
    socket.off("onlineUsers");

socket.on("onlineUsers", (users) => {

    document.querySelectorAll(".status-dot").forEach(dot => {
        const id = dot.dataset.user.toString();

if (users.map(u => u.toString()).includes(id)) {
        
            dot.classList.add("online");
            dot.classList.remove("offline");
            
        } else {
            dot.classList.add("offline");
            dot.classList.remove("online");
            
        }
    });
const headerStatus = document.querySelector(".user-status");

    if (headerStatus && currentReceiver) {
        if (users.includes(currentReceiver)) {
            headerStatus.classList.add("online");
            headerStatus.classList.remove("offline");
        } else {
            headerStatus.classList.add("offline");
            headerStatus.classList.remove("online");
        }
    }
});
let typingTimer;

const input = document.querySelector(".message-input");

input.addEventListener("input", () => {

    clearTimeout(typingTimer);

    socket.emit("typing", {
        sender: userId,
        receiver: currentReceiver
    }); 

    typingTimer = setTimeout(() => {
        // stop typing (optional improvement later)
    }, 1000);

});
socket.off("typing"); // prevent duplicate

socket.on("typing", (data) => {
    if (data.sender === currentReceiver) {
        const el = document.querySelector(".typing-indicator");
        if (!el) return;

        el.innerText = "Typing...";

        clearTimeout(window.typingTimeout);

        window.typingTimeout = setTimeout(() => {
            el.innerText = "";
        }, 1500);
    }
});

console.log("chat initialized");
const token = localStorage.getItem("token");
    
const userId = localStorage.getItem("userId");
    const res = await fetch("/chat/conversations", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const conversations = await res.json();

    const list = document.querySelector(".conversation-list");
    list.innerHTML = "";

    conversations.forEach(conv => {
        const otherUser = conv.participants.find(
            u => u._id !== userId
        );


        list.innerHTML += `
<a href="#" 
   class="conversation-item"
   data-conversation="${conv._id}" 
   data-user="${otherUser._id}">

    <div class="avatar-wrapper">
        <img src="/uploads/profile/${otherUser.photo}" class="avatar">
        <span class="status-dot offline" data-user="${otherUser._id.toString()}"></span>
    </div>

    <div class="conversation-info">
        <div class="top-row">
            <span class="name">${otherUser.name}</span>
            <span class="unread-badge">3</span>
        </div>

        <div class="bottom-row">
            <span class="last-message">
                ${conv.lastMessage || "Start chatting"}
            </span>
        </div>
        
<span class="time">${formatTime(conv.lastMessageTime)}</span>
    </div>

</a>
`;
    });


    document.addEventListener("click", (e) => {
const item = e.target.closest(".conversation-item");
if (item) {
    e.preventDefault();
}
    
    if (!item) return;

    currentConversation = item.dataset.conversation;
    currentReceiver = item.dataset.user;

    currentOtherUser = {
        name: item.querySelector(".name").innerText,
        photo: item.querySelector("img").src
    };
    loadMessages();
});
// send button
document.querySelector(".send-btn")?.addEventListener("click", sendMessage);

// receive message
socket.off("receiveMessage"); // prevent duplicate listeners
socket.on("receiveMessage",(data)=>{
    if(data.sender === currentReceiver){
        appendMessage(data.message,"received");
    }
});

}

document.addEventListener("click", (e) => {

    const item = e.target.closest(".conversation-item");
    if (!item) return;

    // remove active from all
    document.querySelectorAll(".conversation-item")
        .forEach(el => el.classList.remove("active"));

    // add active to clicked
    item.classList.add("active");

    currentConversation = item.dataset.conversation;
    currentReceiver = item.dataset.user;

    // update header name
    document.querySelector(".chat-header-name").innerText = item.dataset.name;

    loadMessages();
});
// ===============================
// OPEN CHAT
// ===============================
async function openChat(receiverId){

currentReceiver = receiverId;

const token = localStorage.getItem("token");

// create / get conversation
const res = await fetch("/chat/conversation",{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body:JSON.stringify({receiverId})
});

const data = await res.json();

currentConversation = data._id;

// load old messages
loadMessages();
const input = document.querySelector(".message-input");


}

// ===============================
// LOAD OLD MESSAGES
// ===============================
async function loadMessages(){

const token = localStorage.getItem("token");

const res = await fetch(`/chat/messages/${currentConversation}`,{
headers:{
Authorization:`Bearer ${token}`
}
});

const messages = await res.json();

const container = document.querySelector(".message-area");
container.innerHTML = "";

messages.forEach(msg => {
    if (msg.sender === userId) {
        appendMessage(msg.message, "sent", msg.createdAt);
    } else {
        appendMessage(msg.message, "received", msg.createdAt);
    }
});

document.querySelector(".chat-header-name").innerText = currentOtherUser.name;
document.querySelector(".chat-header-user img").src = currentOtherUser.photo;

}
// ===============================
// SEND MESSAGE
// ===============================
async function sendMessage(){

const input = document.querySelector(".message-input");
const text = input.value.trim();

if(!text) return;

const token = localStorage.getItem("token");

// save in DB
await fetch("/chat/message",{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body:JSON.stringify({
conversationId:currentConversation,
text:text
})
});

// send via socket
socket.emit("sendMessage",{
sender:userId,
receiver:currentReceiver,
message:text
});

// show instantly
appendMessage(text, "sent", new Date());

input.value="";
}

// ===============================
// APPEND MESSAGE UI
// ===============================
function appendMessage(text, type, time = new Date()) {

    const container = document.querySelector(".message-area");

    const formattedTime = formatMessageTime(time);

    const html = `
    <div class="message-group ${type}">
        <div class="message-bubbles">
            <div class="bubble">
                <p>${text}</p>
                <span class="msg-time">${formattedTime}</span>
            </div>
        </div>
    </div>`;

    container.insertAdjacentHTML("beforeend", html);

    container.scrollTop = container.scrollHeight;
}
// ===============================
// CLICK EVENT (GLOBAL - WORKS DYNAMICALLY)
// ===============================
document.addEventListener("click", async (e)=>{

// when user clicks "Message" button
if(e.target.classList.contains("btn-msg-small")){

    const receiverId = e.target.dataset.id; 

    // load chat UI
    await loadInteriorChatComponent("/component/student/chat.html");
    const container = document.querySelector(".container");
    container.classList.add("chat-page");
    // init chat events
    initChat();

    // open selected chat
    openChat(receiverId);
}
//for responsive
if (e.target.closest("#hamberg")){
  
  console.log(document.querySelectorAll(".li"));
  document.querySelector(".sidebar").classList.toggle("show")  
} 
if (e.target.closest(".li")){
    
    document.querySelector(".sidebar").classList.toggle("show") 
    document.getElementById("hamberg").classList.add("hamberg")
}
//for the chatbar
if(e.target.closest(".chatbar")){
    chatstyle();
    handleGlobalChatClicks();
}


});


 




