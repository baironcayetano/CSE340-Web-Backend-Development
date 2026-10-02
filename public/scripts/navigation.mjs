import deleteToasts from "./toast.mjs";

const navigation = document.querySelector(".site-navigation");
const menuToggle = document.querySelector("#menu-toggle");
const alertContainer = document.querySelector(".toast-container"); 

menuToggle.addEventListener("click",()=>{
    navigation.classList.toggle("show");
    menuToggle.classList.toggle("show");
})

if(alertContainer){
    const alerts = document.querySelectorAll(".alert");
    deleteToasts(alerts, alertContainer);
}

