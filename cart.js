const cartItemsContainer = document.getElementById("cart-items");
const subtotalElement = document.getElementById("cart-subtotal");
const cartCountText = document.querySelector(".cart-count");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Add products to see them here.</p>
            </div>
        `;
        subtotalElement.textContent = "₦0";
        cartCountText.textContent = "0 items";
        return;
    }

    let subtotal = 0;
    cartCountText.textContent = `${cart.length} item(s) in your cart`;

    cart.forEach((item, index) => {

        subtotal += item.price * item.quantity;

        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <div class="item-size">Size: ${item.size}</div>
                    <div class="remove-btn" onclick="removeItem(${index})">
                        Remove
                    </div>
                </div>

                <div class="quantity-box">
                    <button onclick="changeQty(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQty(${index}, 1)">+</button>
                </div>

                <div class="item-price">
                    ₦${(item.price * item.quantity).toLocaleString()}
                </div>
            </div>
        `;
    });

    subtotalElement.textContent = "₦" + subtotal.toLocaleString();
}

function changeQty(index, change) {
    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function clearCart() {
    cart = [];
    localStorage.removeItem("cart");
    renderCart();
}

renderCart();