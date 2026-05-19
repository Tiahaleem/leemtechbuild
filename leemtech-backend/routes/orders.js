const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const ordersFile = path.join(__dirname, "../data/orders.json");

function readOrders() {
  if (!fs.existsSync(ordersFile)) return [];
  const data = fs.readFileSync(ordersFile, "utf8");
  if (!data.trim()) return [];
  return JSON.parse(data);
}

function saveOrders(orders) {
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
}

// GET all orders
router.get("/", (req, res) => {
  const orders = readOrders();
  res.json({ success: true, orders });
});

// POST new order
router.post("/", (req, res) => {
  const orders = readOrders();

  const newOrder = {
    id: "LM-" + Date.now(),
    createdAt: new Date().toISOString(),
    status: "pending",
    ...req.body
  };

  orders.unshift(newOrder);
  saveOrders(orders);

  res.status(201).json({
    success: true,
    message: "Order saved successfully",
    order: newOrder
  });
});

// UPDATE order status
router.patch("/:id/status", (req, res) => {
  const orders = readOrders();
  const { id } = req.params;
  const { status } = req.body;

  const allowed = ["pending", "processing", "delivered", "cancelled"];

  if (!allowed.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status"
    });
  }

  const order = orders.find(order => order.id === id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found"
    });
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();

  saveOrders(orders);

  res.json({
    success: true,
    message: "Status updated",
    order
  });
});

// DELETE order
router.delete("/:id", (req, res) => {
  const orders = readOrders();
  const { id } = req.params;

  const filtered = orders.filter(order => order.id !== id);

  if (filtered.length === orders.length) {
    return res.status(404).json({
      success: false,
      message: "Order not found"
    });
  }

  saveOrders(filtered);

  res.json({
    success: true,
    message: "Order deleted"
  });
});

module.exports = router;