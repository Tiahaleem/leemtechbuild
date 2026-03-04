const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".header_context");

hamburger.addEventListener("click", () => {
    menu.classList.toggle("active");
});

// 🔥 show ONLY featured products
renderProducts(PRODUCTS, { featuredOnly: true });

// document.addEventListener("DOMContentLoaded", () => {
//     renderProducts(PRODUCTS, { featuredOnly: true });
// });