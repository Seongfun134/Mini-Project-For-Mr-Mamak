import express from "express";
import cors from "cors";
import menuData from "./menuData.json" with { type: "json" };

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for orders
let orders = [];
let orderIdCounter = 1;

// Routes

// Get all menu items
app.get("/api/menu", (req, res) => {
  res.json(menuData.menu);
});

// Submit order
app.post("/api/orders", (req, res) => {
  const { items, customerName, customerPhone } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Order must contain items" });
  }

  // Calculate total price and profit
  let totalPrice = 0;
  let totalCost = 0;

  items.forEach((item) => {
    totalPrice += item.price * item.quantity;
    totalCost += item.cost * item.quantity;
  });

  const netProfit = totalPrice - totalCost;

  const newOrder = {
    id: orderIdCounter++,
    customerName: customerName || "Walk-in Customer",
    customerPhone: customerPhone || "N/A",
    items: items,
    totalPrice: parseFloat(totalPrice.toFixed(2)),
    totalCost: parseFloat(totalCost.toFixed(2)),
    netProfit: parseFloat(netProfit.toFixed(2)),
    status: "Pending",
    timestamp: new Date().toISOString(),
  };

  orders.push(newOrder);
  res.status(201).json({
    message: "Order submitted successfully",
    order: newOrder,
  });
});

// Get all orders (Admin)
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

// Get single order by ID
app.get("/api/orders/:id", (req, res) => {
  const order = orders.find((o) => o.id === parseInt(req.params.id));
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json(order);
});

// Update order (Admin - edit items)
app.put("/api/orders/:id", (req, res) => {
  const order = orders.find((o) => o.id === parseInt(req.params.id));

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  const { items, status } = req.body;

  if (items) {
    order.items = items;

    // Recalculate totals
    let totalPrice = 0;
    let totalCost = 0;

    items.forEach((item) => {
      totalPrice += item.price * item.quantity;
      totalCost += item.cost * item.quantity;
    });

    order.totalPrice = parseFloat(totalPrice.toFixed(2));
    order.totalCost = parseFloat(totalCost.toFixed(2));
    order.netProfit = parseFloat((totalPrice - totalCost).toFixed(2));
  }

  if (status) {
    order.status = status;
  }

  res.json({
    message: "Order updated successfully",
    order: order,
  });
});

// Delete item from order (Admin)
app.delete("/api/orders/:id/items/:itemId", (req, res) => {
  const order = orders.find((o) => o.id === parseInt(req.params.id));

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  const itemIndex = order.items.findIndex(
    (item) => item.id === parseInt(req.params.itemId),
  );

  if (itemIndex === -1) {
    return res.status(404).json({ error: "Item not found in order" });
  }

  order.items.splice(itemIndex, 1);

  // Recalculate totals
  let totalPrice = 0;
  let totalCost = 0;

  order.items.forEach((item) => {
    totalPrice += item.price * item.quantity;
    totalCost += item.cost * item.quantity;
  });

  order.totalPrice = parseFloat(totalPrice.toFixed(2));
  order.totalCost = parseFloat(totalCost.toFixed(2));
  order.netProfit = parseFloat((totalPrice - totalCost).toFixed(2));

  res.json({
    message: "Item deleted from order",
    order: order,
  });
});

// Add item to existing order (Admin)
app.post("/api/orders/:id/items", (req, res) => {
  const order = orders.find((o) => o.id === parseInt(req.params.id));

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  const { item } = req.body;

  if (!item) {
    return res.status(400).json({ error: "Item data required" });
  }

  // Check if item already exists in order
  const existingItem = order.items.find((i) => i.id === item.id);

  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    order.items.push(item);
  }

  // Recalculate totals
  let totalPrice = 0;
  let totalCost = 0;

  order.items.forEach((item) => {
    totalPrice += item.price * item.quantity;
    totalCost += item.cost * item.quantity;
  });

  order.totalPrice = parseFloat(totalPrice.toFixed(2));
  order.totalCost = parseFloat(totalCost.toFixed(2));
  order.netProfit = parseFloat((totalPrice - totalCost).toFixed(2));

  res.json({
    message: "Item added to order",
    order: order,
  });
});

// Get dashboard stats (Admin)
app.get("/api/stats", (req, res) => {
  let totalRevenue = 0;
  let totalProfit = 0;
  let totalOrders = orders.length;
  let pendingOrders = 0;
  let completedOrders = 0;

  orders.forEach((order) => {
    totalRevenue += order.totalPrice;
    totalProfit += order.netProfit;

    if (order.status === "Pending") pendingOrders++;
    if (order.status === "Completed") completedOrders++;
  });

  res.json({
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    totalProfit: parseFloat(totalProfit.toFixed(2)),
    totalOrders,
    pendingOrders,
    completedOrders,
  });
});

// Delete entire order (Admin)
app.delete("/api/orders/:id", (req, res) => {
  const orderIndex = orders.findIndex((o) => o.id === parseInt(req.params.id));

  if (orderIndex === -1) {
    return res.status(404).json({ error: "Order not found" });
  }

  const deletedOrder = orders.splice(orderIndex, 1);

  res.json({
    message: "Order deleted successfully",
    order: deletedOrder[0],
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🍜 Mamak Server running on http://localhost:${PORT}`);
  console.log("📊 Admin Dashboard: http://localhost:3000/admin");
});
