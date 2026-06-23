const submitform = async (e) => {
    e.preventDefault();
    
    const student=document.getElementById("studentName").value;
    const teacher=document.getElementById("teacherName").value;
    const studentemail=document.getElementById("studentEmail").value;
    const teachermail= document.getElementById("teacherEmail").value;
    const studntpassword=document.getElementById("studentPassword").value;
    const teacherpassword=document.getElementById("teacherPassword").value;
     
    let userData
    if(document.getElementById("role").value === "Student"){
         //  validation
        if (!  student ||  ! studentemail|| !studntpassword) {
        alert("please fill the required field to proceed")
            return ;
        }
        userData = {
        
        name: student,
        email: studentemail,
        password: studntpassword,
        role: document.getElementById("role").value,
        
    };
    }else{
         //  validation
        if (!  teacher ||  ! teachermail|| !teacherpassword) {
        alert("please fill the required field to proceed")
            return;
        }
       userData = {
        
        name: teacher,
        email: teachermail,
        password:teacherpassword,
        role: document.getElementById("role").value,
        
    }; 
    }
    try {
        const res = await fetch("/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        const data = await res.json();

        console.log(data);
        if (data.ok)
        alert("User registered successfully!");

    } catch (error) {
        console.log(error);
        alert("Something went wrong!");
    }
    let Data;
    if(document.getElementById("role").value === "Student"){ Data ={
    email: studentemail,
    password:studntpassword}}
    else{ Data ={
    email:teachermail,
    password:teacherpassword}}
    

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

    // clear form
    
    document.getElementById("studentName").value = "";
    document.getElementById("studentEmail").value = "";
    document.getElementById("studentPassword").value = "";
    document.getElementById("role").value = "Select Role";
    
    document.getElementById("teacherName").value="";
    document.getElementById("teacherEmail").value ="";
    document.getElementById("teacherPassword").value ="";
    
};






const roleSelect = document.getElementById("role");

roleSelect.addEventListener("change", () => {
    console.log("submitbtn clicked");
  const role = roleSelect.value;

  document.getElementById("studentFields").style.display = "none";
  document.getElementById("teacherFields").style.display = "none";

  if (role === "Student") {
    document.getElementById("studentFields").style.display = "block";
  }

  if (role === "Teacher") {
    document.getElementById("teacherFields").style.display = "block";
  }
});
//form submit
const form= document.getElementById("form")
console.log(form);

form.addEventListener("submit",submitform);