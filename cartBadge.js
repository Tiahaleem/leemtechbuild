// ===============================
// UPDATE CART BADGE
// ===============================
function updateCartBadge() {
    const badge = document.getElementById("cart-count");
    if (!badge) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // count total quantity
    const totalItems = cart.reduce((total, item) => {
        return total + item.quantity;
    }, 0);

    badge.textContent = totalItems;

    // hide badge if empty
    if (totalItems === 0) {
        badge.style.display = "none";
    } else {
        badge.style.display = "flex";
    }
}


// Run on page load
document.addEventListener("DOMContentLoaded", updateCartBadge);