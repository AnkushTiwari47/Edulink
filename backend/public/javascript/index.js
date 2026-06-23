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
    const data= await response.json()
    console.log(data);
    if (response.ok){
        alert("request sent");
    }else{alert("request already sent")}
    
}
function openModal(card) {

  const modal = document.getElementById("teacher-modal");
  const body = document.getElementById("modal-body");
  const id = card.dataset.id;
  const name = card.dataset.name;
  const subject = card.dataset.subject;
  const location = card.dataset.location;
  const qualification = card.dataset.qualification;
  const photo = card.dataset.photo;
  const bio = card.dataset.bio;
  const grade = card.dataset.grade;
  const college = card.dataset.college;
  body.innerHTML = `
    <div class="profile-modal" data-id="${id}">

  <!-- LEFT PANEL -->
  <div class="profile-left">
    <div class="cover"></div>

    <div class="profile-img-wrapper">
      <img src="/uploads/profile/${photo}" class="profile-img">
    </div>

    <h2>${name}</h2>
    <p class="title">${subject}</p>

    <p class="exp">EXPERIENCED ${subject} EDUCATOR</p>

    <div class="rating">⭐ 4.8 <span>(112 Reviews)</span></div>

    <div class="buttons">
      <button class="contact-btn connect">CONECT</button>
      <button class="book-btn">BOOK NOW</button>
    </div>
  </div>

  <!-- RIGHT PANEL -->
  <div class="profile-right">

    <h2 class="heading">TEACHER PROFILE</h2>

    <div class="grid">

      <div class="card">
        <h3>🧑‍🏫 ABOUT ME</h3>
        <p>${bio}</p>
      </div>

      <div class="card">
        <h3>📘 SUBJECTS TAUGHT</h3>
        <div class="tags">
          ${subject.split(",").map(s => `<span>${s}</span>`).join("")}
        </div>
      </div>

      <div class="card">
        <h3>💰 FEES</h3>
        <p>₹500 / Month (Private)</p>
      </div>

      <div class="card">
        <h3>🏫 CLASSES & LEVELS</h3>
        <div class="tags">
          <span>${grade}</span>
          <span>Grades 11–12</span>
        </div>
      </div>

      <div class="card">
        <h3>🎓 QUALIFICATIONS</h3>
        <p>${qualification}</p>
      </div>

      <div class="card">
        <h3>🏛 EDUCATION</h3>
        <p>${college}</p>
      </div>

    </div>

  </div>

</div>
  `;

  modal.style.display = "flex";
}
//searching teachers======================================================
async function searchTeachers(page = 1) {
  const name = document.getElementById("search-name").value;
  const subject = document.getElementById("search-subject").value;
  const location = document.getElementById("search-location").value;

  const res = await fetch(
    `/user/searchTeacher?name=${name}&subject=${subject}&location=${location}&page=${page}`
  );

  const data = await res.json();
  console.log(data);

  renderTeachers(data.teachers);
  //renderPagination(data.totalPages, page);
}
async function renderTeachers (data){
  
  let html="";
  data.forEach(teacher=>{
    html+=`
    <div class="teacher-card" 
     data-id="${teacher.teacherId._id}"
     data-name="${teacher.teacherId.name}"
     data-subject="${teacher.subject.join(", ")}"
     data-location="${teacher.location}"
     data-qualification="${teacher.qualifications}"
     data-photo="${teacher.photo}"
     data-bio="${teacher.bio}"
     data-grade="${teacher.grade}" 
     data-college="${teacher.college}">
  <div class="profile-container">
    <img src="/uploads/profile/${teacher.photo}" alt="Dr. Sarah Johnson" class="profile-img borderblue">
  </div>

  <div class="info-container">
    <p class="field"><strong>Name:</strong> ${teacher.teacherId.name}</p>
    <p class="field"><strong>Subject:</strong> ${teacher.subject}</p>
    <p class="description">Connect with ${teacher.teacherId.name}for personalized learning paths.</p>
  </div>

  <div class="button-group">
    <button class="btn btn-outline connect">
      <span class="icon">🔗</span> CONNECT
    </button>
    <button class="btn btn-filled view">
      VIEW PROFILE <span class="icon">↗</span>
    </button>
  </div>
</div>
    
    `
  });
   document.querySelector(".teacher-container").innerHTML=html;
}


//gsap




gsap.registerPlugin(ScrollTrigger);

gsap.from(".img", {
  y: 300,
  opacity: 0,
  rotation: 5,
  duration: 1,
  stagger: 0.4,

  scrollTrigger: {
    trigger: ".image-stack",
    start: "top 85%",
    toggleActions: "restart none none none"
  }
});
gsap.from(".Gsab div",{
y:200,
opacity:0,

stagger:0.2,
scrollTrigger:{
trigger:".Gsab",
start:"top 80%",
toggleActions: 'play reverse play reverse'
}
});

//swiper (how to use)


var swiper = new Swiper(".swiper", {
  loop: true,
  spaceBetween: 30,
  slidesPerView: 1,
  autoplay: {
    delay: 2000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  }
});

//core js for index


document.getElementById("arrow").addEventListener("click",()=>{
    
    document.getElementById("dropdown").classList.toggle("show")
});
document.body.addEventListener("click", function(e) {
    console.log("Clicked:", e.target);
    if (!e.target.matches("#arrow")){
      document.getElementById("dropdown").classList.remove("show")
    }  
    if (e.target.matches(".connect")){
sendConnectionRequest();
    }
});
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  menuToggle.classList.toggle("open");
});
//after login only

// ================= MOBILE + DESKTOP PROFILE DROPDOWN =================

const profileTrigger = document.querySelector(".profile-trigger");
const dropdown = document.getElementById("dropdown");

profileTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("show");
});

document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("show");
    }
});
//HIDE AND DISPLAY OF LOGEDIN MENU
function logout(){

localStorage.removeItem("token");

document.getElementById("guest-menu").style.display = "flex";

document.getElementById("user-menu").style.display = "none";

/* mobile auth visible again */
document.querySelector(".mobile-auth").style.display = "flex";

}

const checklogin = async ()=>{
    console.log("login checked");
    const token= localStorage.getItem("token");
    if (!token){
        document.getElementById("user-menu").style.display ="none";
document.getElementById("guest-menu").style.display="flex";
return
    }
    try {
       const res= await fetch("/user/check",{
       headers: {
        Authorization:`Bearer ${token}`
       }
       }) ;
       const data= await res.json();
       if (data.loggedIn){

document.getElementById("user-menu").style.display ="flex";

document.getElementById("guest-menu").style.display ="none";

/* hide mobile login signup */
document.querySelector(".mobile-auth").style.display = "none";

}
else{
    logout();
}
    } catch (error) {
       logout(); 
    }
}
document.addEventListener("DOMContentLoaded",checklogin)
//logout
console.log(document.getElementById("logout-btn"))
document.addEventListener("DOMContentLoaded", () => {

  const logoutBtn = document.getElementById("logout-btn");

  if(logoutBtn){
    logoutBtn.addEventListener("click", ()=>{
        localStorage.removeItem("token")
        window.location.href ="index.html"
    });
  }

});
//===============fetching teacher==================
async function fetchteachers(){
  const response= await fetch("/user/fetchTeacher");
  const teachers= await response.json()
  console.log(teachers);
  let html="";
  teachers.forEach(teacher => {
    html+=`<div class="teacher-card" 
     data-id="${teacher.teacherId._id}"
     data-name="${teacher.teacherId.name}"
     data-subject="${teacher.subject.join(", ")}"
     data-location="${teacher.location}"
     data-qualification="${teacher.qualifications}"
     data-photo="${teacher.photo}"
     data-bio="${teacher.bio}"
     data-grade="${teacher.grade}" 
     data-college="${teacher.college}">
  <div class="profile-container">
    <img src="/uploads/profile/${teacher.photo}" alt="Dr. Sarah Johnson" class="profile-img borderblue">
  </div>

  <div class="info-container">
    <p class="field"><strong>Name:</strong> ${teacher.teacherId.name}</p>
    <p class="field"><strong>Subject:</strong> ${teacher.subject}</p>
    <p class="description">Connect with ${teacher.teacherId.name}for personalized learning paths.</p>
  </div>

  <div class="button-group">
    <button class="btn btn-outline connect">
      <span class="icon">🔗</span> CONNECT
    </button>
    <button class="btn btn-filled view">
      VIEW PROFILE <span class="icon">↗</span>
    </button>     
  </div>
</div>` 
  });
  document.querySelector(".top-teachers").innerHTML=html;
}
fetchteachers();
document.addEventListener("click",async (e)=>{
  if (e.target.classList.contains("view")) {

    const card = e.target.closest(".teacher-card");

    //  Get full data from attributes OR store JSON
    const name = card.querySelector(".field strong + text");
    
    const teacherId = card.dataset.id;

    openModal(card);
    
  }
  if (e.target.matches("#search")){
    debounceSearch();
    
    window.location.href="#search-results"
  }
  if (e.target.classList.contains("connect")){
   
const token=localStorage.getItem("token");
if(!token){
  
  return
}
const  receiverId=e.target.closest(".teacher-card,.profile-modal").dataset.id;
      sendConnectionRequest(receiverId);
  }
})
window.addEventListener("click", (e) => {
  const modal = document.getElementById("teacher-modal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("teacher-modal").style.display = "none";
});
//=============================================================
let timeout;

function debounceSearch() {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    searchTeachers();
  }, 400); // wait 400ms after typing
}
document.addEventListener("input",async (e)=>{
  if (e.target.matches("#search-name")){
     debounceSearch();
  }
  if (e.target.matches("#search-subject")){
     debounceSearch();
  }
  if (e.target.matches("#search-location")){
     debounceSearch();
  }
});

