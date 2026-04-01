document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const menu = document.querySelector(".header_context");

    if (hamburger && menu) {
        hamburger.addEventListener("click", () => {
            menu.classList.toggle("active");
        });
    }

    // 🔥 Show only featured products
    if (typeof renderProducts === "function") {
        renderProducts(PRODUCTS, { featuredOnly: true });
    }

    updateCartBadge();
});