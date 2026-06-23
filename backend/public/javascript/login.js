const login= async(e)=>{
    e.preventDefault();
const Email =document.getElementById("loginEmail").value;
const Password =document.getElementById("loginPassword").value;
console.log("clicked");
//validation
if(!Email|| !Password){
    alert("please enter email and password");
    return ;
}
console.log("clicked");
const Data ={
    email:Email,
    password:Password
}
try {
   const response = await fetch("/user/login",{
    method:"POST",
    headers:{
        "Content-Type": "application/json"
    },
    body:JSON.stringify(Data)
   });
   const receivedData = await response.json();
   console.log(receivedData);
   if (receivedData.message ==="login successful"){
    alert("User logedin successfully!");
    localStorage.setItem("token",receivedData.token)
    window.location.href="../pages/account.html?receivedData.user.id"
   }else{
    alert("wrong email or password!")
   }
    
} catch (error) {
    console.log(error);
        alert("Something went wrong!");
}
//clear input
   document.getElementById("loginEmail").value =""
   document.getElementById("loginPassword").value =""

};    

 

const loginbtn = document.getElementById("login-btn")
loginbtn.addEventListener("click",login);