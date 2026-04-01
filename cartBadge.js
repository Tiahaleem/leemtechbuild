function updateCartBadge() {
    const badge = document.getElementById("cart-count");
    if (!badge) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const totalItems = cart.reduce((total, item) => {
        return total + (item.quantity || 0);
    }, 0);

    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? "flex" : "none";
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
window.addEventListener("storage", updateCartBadge);