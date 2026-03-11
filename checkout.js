const GOOGLE_SHEETS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbwRzmsJEIhEbDmAHpt2O_-onpZkbOv_nl8nN4USDCz0dWJu5dc9hsWnZKAZsBou_6Vc/exec";
const GOOGLE_SECRET = "LEEMTECH_2026";

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
            <small>${item.size} • ₦${Number(item.price).toLocaleString()} each • Qty ${item.quantity}</small>
          </div>
          <div class="right">${money(total)}</div>
        </div>
      `;
    });
  }

  if (subtotalElement) subtotalElement.textContent = money(subtotal);
  if (deliveryElement) deliveryElement.textContent = money(deliveryFee);
  if (inspectionElement) inspectionElement.textContent = inspectionFee ? money(inspectionFee) : "—";

  const grandTotal = subtotal + deliveryFee + inspectionFee;
  if (grandElement) grandElement.textContent = money(grandTotal);
}

async function exportOrderToGoogleSheets(orderPayload) {
  const res = await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(orderPayload)
  });

  const data = await res.json().catch(() => null);

  if (!data || data.ok !== true) {
    throw new Error(data?.error || "Failed to export order");
  }

  return data.orderId;
}

// ==============================
// EVENTS
// ==============================
if (stateSelect) {
  stateSelect.addEventListener("change", () => {
    const opt = stateSelect.options[stateSelect.selectedIndex];
    deliveryFee = Number(opt?.dataset?.fee || 0);
    renderSummary();
  });
}

document.querySelectorAll('input[name="inspection"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    inspectionFee = (getInspectionChoice() === "yes") ? INSPECTION_FEE_AMOUNT : 0;
    renderSummary();
  });
});

// ==============================
// WHATSAPP SEND + GOOGLE SHEETS
// ==============================
async function sendToWhatsApp() {
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

  const payload = {
    secret: GOOGLE_SECRET,
    name,
    phone,
    address,
    state,
    inspection: inspectionChoice,
    deliveryFee,
    inspectionFee,
    subtotal,
    grandTotal,
    items: cart.map((item) => ({
      id: item.id || "",
      name: item.name,
      size: item.size,
      price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity
    }))
  };

  let orderId = "";

  try {
    orderId = await exportOrderToGoogleSheets(payload);
    showToast(`Order saved successfully (${orderId})`);
  } catch (error) {
    console.error(error);
    showToast("Could not save order to Google Sheets, but WhatsApp will still open.");
  }

  let message = `Hello Leemtech, I want to place an order.\n\n`;

  if (orderId) {
    message += `Order ID: ${orderId}\n\n`;
  }

  message += `Customer Details:\n`;
  message += `Name: ${name}\n`;
  message += `Phone: ${phone}\n`;
  message += `Delivery Address: ${address}\n`;
  message += `State: ${state}\n`;
  message += `Site Inspection: ${inspectionChoice.toUpperCase()}\n\n`;

  message += `Order Items:\n`;
  cart.forEach((item, i) => {
    message += `${i + 1}. ${item.name}\n`;
    message += `   Size: ${item.size}\n`;
    message += `   Qty: ${item.quantity}\n`;
    message += `   Unit Price: ₦${Number(item.price).toLocaleString()}\n`;
    message += `   Total: ₦${(Number(item.price) * Number(item.quantity)).toLocaleString()}\n\n`;
  });

  message += `Summary:\n`;
  message += `Subtotal: ₦${subtotal.toLocaleString()}\n`;
  message += `Delivery Fee: ₦${deliveryFee.toLocaleString()}\n`;
  message += `Inspection Fee: ${inspectionFee ? "₦" + inspectionFee.toLocaleString() : "—"}\n`;
  message += `Grand Total: ₦${grandTotal.toLocaleString()}\n\n`;
  message += `Thank you.`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");

  // OPTIONAL: clear cart after opening WhatsApp
  // localStorage.removeItem("cart");
  // renderSummary();
}

// Button
if (placeOrderBtn) {
  placeOrderBtn.addEventListener("click", sendToWhatsApp);
}

// ==============================
// INIT
// ==============================
renderSummary();