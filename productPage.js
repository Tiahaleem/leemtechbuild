// get product id from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const product = PRODUCTS[productId];

if(!product){
    document.body.innerHTML = "<h2 style='padding:40px'>Product not found</h2>";
}

// ELEMENTS
const title = document.querySelector(".product_title");
const category = document.querySelector(".product_category");
const desc = document.querySelector(".product_desc");
const image = document.querySelector(".product_image");
const unitPrice = document.getElementById("unitPrice");
const subtotal = document.getElementById("subtotal");
const quantityInput = document.getElementById("quantity");
const sizeContainer = document.querySelector(".size_options");
const addBtn = document.getElementById("addToCart");

let currentPrice = 0;
let selectedSize = null;

// LOAD PRODUCT INFO
title.textContent = product.name;
category.textContent = product.category;
desc.textContent = product.description;
image.src = product.image;


// CREATE SIZE BUTTONS
Object.entries(product.sizes).forEach(([size, price], index) => {

    const btn = document.createElement("button");
    btn.classList.add("size_btn");
    btn.textContent = size;
    btn.dataset.price = price;

    // first size auto selected
    if(index === 0){
        btn.classList.add("active");
        selectedSize = size;
        currentPrice = price;
        unitPrice.textContent = "₦" + price.toLocaleString();
    }

    btn.addEventListener("click", () => {

        document.querySelectorAll(".size_btn")
        .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        selectedSize = size;
        currentPrice = price;

        unitPrice.textContent = "₦" + price.toLocaleString();
        calculateSubtotal();
    });

    sizeContainer.appendChild(btn);
});


// SUBTOTAL
function calculateSubtotal(){
    const qty = parseInt(quantityInput.value) || 1;
    subtotal.textContent = "₦" + (currentPrice * qty).toLocaleString();
}

quantityInput.addEventListener("input", calculateSubtotal);
calculateSubtotal();


// ADD TO CART
addBtn.addEventListener("click", () => {

    const qty = parseInt(quantityInput.value) || 1;

    const cartItem = {
        id: productId,
        name: product.name,
        size: selectedSize,
        price: currentPrice,
        quantity: qty,
        image: product.image
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // check if same product already exists
    const existing = cart.find(item =>
        item.id === cartItem.id && item.size === cartItem.size
    );

    if(existing){
        existing.quantity += qty;
    }else{
        cart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartBadge();
showToast(`${product.name} added to cart!`);
});
function showToast(message) {
    const toast = document.getElementById("cart-toast");
    const text = document.getElementById("toast-message");

    text.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}
