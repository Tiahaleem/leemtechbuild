// ==============================
// SETTINGS
// ==============================
const WHATSAPP_NUMBER = "2348136828054"; // no + sign
const INSPECTION_FEE_AMOUNT = 2000;

// ==============================
// CART
// ==============================
const cart = JSON.parse(localStorage.getItem("cart")) || [];

// ==============================
// ELEMENTS
// ==============================
const summaryContainer = document.getElementById("summary-items");
const subtotalElement = document.getElementById("subtotal");
const deliveryElement = document.getElementById("deliveryFee");
const inspectionElement = document.getElementById("inspectionFee");
const grandElement = document.getElementById("grandTotal");

const stateSelect = document.getElementById("state");
const placeOrderBtn = document.getElementById("placeOrderBtn");

// Toast
const toastEl = document.getElementById("cart-toast");
const toastMsgEl = document.getElementById("toast-message");
let toastTimer = null;

// ==============================
// STATE
// ==============================
let deliveryFee = 0;
let inspectionFee = 0;

// ==============================
// HELPERS
// ==============================
function money(n) {
  return "₦" + Number(n || 0).toLocaleString();
}

function showToast(message) {
  if (!toastEl || !toastMsgEl) return;

  toastMsgEl.textContent = message;
  toastEl.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("show");
  }, 2600);
}

function calcSubtotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function getInspectionChoice() {
  return document.querySelector('input[name="inspection"]:checked')?.value || "no";
}

function renderSummary() {
  if (!summaryContainer) return;

  const subtotal = calcSubtotal();
  summaryContainer.innerHTML = "";

  if (cart.length === 0) {
    summaryContainer.innerHTML = `
      <p style="color:#64748b;font-size:15px;margin:0;">
        Your cart is empty.
      </p>
    `;
  } else {
    cart.forEach((item) => {
      const total = item.price * item.quantity;

      summaryContainer.innerHTML += `
        <div class="summary-item">
          <div class="left">
            <b>${item.name}</b>
            <small>${item.size} • ₦${item.price.toLocaleString()} each • Qty ${item.quantity}</small>
          </div>
          <div class="right">${money(total)}</div>
        </div>
      `;
    });
  }

  if (subtotalElement) subtotalElement.textContent = money(subtotal);
  if (deliveryElement) deliveryElement.textContent = money(deliveryFee);

  // show dash when 0 like your UI
  if (inspectionElement) inspectionElement.textContent = inspectionFee ? money(inspectionFee) : "—";

  const grandTotal = subtotal + deliveryFee + inspectionFee;
  if (grandElement) grandElement.textContent = money(grandTotal);
}

// ==============================
// EVENTS
// ==============================

// Delivery fee from state select
if (stateSelect) {
  stateSelect.addEventListener("change", () => {
    const opt = stateSelect.options[stateSelect.selectedIndex];
    deliveryFee = Number(opt?.dataset?.fee || 0);
    renderSummary();
  });
}

// Inspection yes/no radios
document.querySelectorAll('input[name="inspection"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    inspectionFee = (getInspectionChoice() === "yes") ? INSPECTION_FEE_AMOUNT : 0;
    renderSummary();
  });
});

// ==============================
// WHATSAPP SEND
// ==============================
function sendToWhatsApp() {
  const name = document.getElementById("fullName")?.value.trim() || "";
  const phone = document.getElementById("phone")?.value.trim() || "";
  const address = document.getElementById("address")?.value.trim() || "";
  const state = stateSelect?.value || "";
  const inspectionChoice = getInspectionChoice();

  if (cart.length === 0) {
    showToast("Your cart is empty. Add products before checkout.");
    return;
  }

  if (!name || !phone || !address || !state) {
    showToast("Please fill all required fields (Name, Phone, Address, State).");
    return;
  }

  const subtotal = calcSubtotal();
  const grandTotal = subtotal + deliveryFee + inspectionFee;

  // WhatsApp message (clean + readable)
  let msg = `Hello Leemtech, I want to place an order.%0A%0A`;

  msg += `Customer Details:%0A`;
  msg += `Name: ${name}%0A`;
  msg += `Phone: ${phone}%0A`;
  msg += `Delivery Address: ${address}%0A`;
  msg += `State: ${state}%0A`;
  msg += `Site Inspection: ${inspectionChoice.toUpperCase()}%0A%0A`;

  msg += `Order Items:%0A`;
  cart.forEach((item, i) => {
    msg += `${i + 1}. ${item.name}%0A`;
    msg += `   Size: ${item.size}%0A`;
    msg += `   Qty: ${item.quantity}%0A`;
    msg += `   Unit Price: ₦${item.price.toLocaleString()}%0A`;
    msg += `   Total: ₦${(item.price * item.quantity).toLocaleString()}%0A%0A`;
  });

  msg += `Summary:%0A`;
  msg += `Subtotal: ₦${subtotal.toLocaleString()}%0A`;
  msg += `Delivery Fee: ₦${deliveryFee.toLocaleString()}%0A`;
  msg += `Inspection Fee: ${inspectionFee ? ("₦" + inspectionFee.toLocaleString()) : "—"}%0A`;
  msg += `Grand Total: ₦${grandTotal.toLocaleString()}%0A%0A`;
  msg += `Thank you.`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  window.open(url, "_blank");
}

// Button
if (placeOrderBtn) {
  placeOrderBtn.addEventListener("click", sendToWhatsApp);
}

// ==============================
// INIT
// ==============================
renderSummary();