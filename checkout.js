const GOOGLE_SHEETS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbx8y4V3P1fnGiEOHkY-FO6BBqOYwMs-xmvcbmiIIkIdM6tI7jzspnEVyKVHCEZBVOWE/exec";
const GOOGLE_SECRET = "LEEMTECH_2026";

// SETTINGS
const WHATSAPP_NUMBER = "2348152884853";
const INSPECTION_FEE_AMOUNT = 15000;

// CART
const cart = JSON.parse(localStorage.getItem("cart")) || [];

// ELEMENTS
const summaryContainer = document.getElementById("summary-items");
const subtotalElement = document.getElementById("subtotal");
const inspectionElement = document.getElementById("inspectionFee");
const grandElement = document.getElementById("grandTotal");
const stateSelect = document.getElementById("state");
const placeOrderBtn = document.getElementById("placeOrderBtn");

// TOAST
const toastEl = document.getElementById("cart-toast");
const toastMsgEl = document.getElementById("toast-message");
let toastTimer = null;

// STATE
let inspectionFee = 0;

// HELPERS
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
  return cart.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
}

function getInspectionChoice() {
  return document.querySelector('input[name="inspection"]:checked')?.value || "no";
}

function renderSummary() {
  const subtotal = calcSubtotal();
  summaryContainer.innerHTML = "";

  if (!cart.length) {
    summaryContainer.innerHTML = `<p>Your cart is empty.</p>`;
  } else {
    cart.forEach((item) => {
      const total = Number(item.price) * Number(item.quantity);

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

  subtotalElement.textContent = money(subtotal);
  inspectionElement.textContent = inspectionFee ? money(inspectionFee) : "—";
  grandElement.textContent = money(subtotal + inspectionFee);
}

async function exportOrderToGoogleSheets(orderPayload) {
  const res = await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(orderPayload)
  });

  const text = await res.text();
  const data = JSON.parse(text);

  if (!data || data.ok !== true) {
    throw new Error(data?.error || "Failed to export order");
  }

  return data.orderId;
}

// INSPECTION
document.querySelectorAll('input[name="inspection"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    inspectionFee = getInspectionChoice() === "yes" ? INSPECTION_FEE_AMOUNT : 0;
    renderSummary();
  });
});

// SEND ORDER
async function sendToWhatsApp() {
  const name = document.getElementById("fullName")?.value.trim() || "";
  const phone = document.getElementById("phone")?.value.trim() || "";
  const address = document.getElementById("address")?.value.trim() || "";
  const state = stateSelect?.value || "";
  const inspectionChoice = getInspectionChoice();

  if (!cart.length) {
    showToast("Your cart is empty.");
    return;
  }

  if (!name || !phone || !address || !state) {
    showToast("Fill all required fields.");
    return;
  }

  const subtotal = calcSubtotal();
  const grandTotal = subtotal + inspectionFee;

  const payload = {
    secret: GOOGLE_SECRET,
    name,
    phone,
    address,
    state,
    inspection: inspectionChoice,
    inspectionFee,
    subtotal,
    grandTotal,
    items: cart.map(item => ({
      id: item.id || "",
      name: item.name,
      size: item.size,
      price: Number(item.price),
      quantity: Number(item.quantity),
      total: Number(item.price) * Number(item.quantity)
    }))
  };

  let orderId = "";

  try {
    orderId = await exportOrderToGoogleSheets(payload);
    showToast(`Order saved (${orderId})`);
  } catch (e) {
    console.error("Sheets error:", e);
    showToast("Could not save order to sheet.");
  }

  let msg = `Hello Leemtech, I want to place an order.\n\n`;

  if (orderId) {
    msg += `Order ID: ${orderId}\n\n`;
  }

  msg += `Name: ${name}\n`;
  msg += `Phone: ${phone}\n`;
  msg += `Address: ${address}\n`;
  msg += `State: ${state}\n`;
  msg += `Inspection: ${inspectionChoice.toUpperCase()}\n`;
  msg += `Delivery Fee: To be discussed with management\n\n`;

  cart.forEach((item, i) => {
    msg += `${i + 1}. ${item.name} (${item.size}) x${item.quantity} = ₦${(Number(item.price) * Number(item.quantity)).toLocaleString()}\n`;
  });

  msg += `\nSubtotal: ₦${subtotal.toLocaleString()}`;
  msg += `\nInspection Fee: ${inspectionFee ? money(inspectionFee) : "—"}`;
  msg += `\nGrand Total: ₦${grandTotal.toLocaleString()}`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
}

if (placeOrderBtn) {
  placeOrderBtn.addEventListener("click", sendToWhatsApp);
}

renderSummary();