const navigation = document.querySelector(".site-navigation");
const menuToggle = document.querySelector("#menu-toggle");

menuToggle.addEventListener("click",()=>{
    navigation.classList.toggle("show");
    menuToggle.classList.toggle("show");
})