import { useState, useEffect } from "react";

const STATUS_COLOR = {
  Pending: "#f59e0b",
  Preparing: "#3b82f6",
  Ready: "#8b5cf6",
  Completed: "#22c55e",
};

const PAYMENT_COLOR = {
  "Pending Payment": "#f59e0b",
  Paid: "#22c55e",
  "Payment Failed": "#ef4444",
  Refunded: "#6b7280",
};

export default function OrderHistoryPage({ currentUser }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem("orders")) || [];
    const mine = all.filter((o) => o.userId === currentUser?.id);
    setOrders(mine.slice().reverse());
  }, [currentUser]);

  if (orders.length === 0) {
    return (
      <div className="info-page">
        <h1 className="info-page-title">Order History</h1>
        <p style={{ textAlign: "center", color: "#999", marginTop: "2rem" }}>
          You have no orders yet. Head to the Menu to place your first order!
        </p>
      </div>
    );
  }

  return (
    <div className="info-page">
      <h1 className="info-page-title">Order History</h1>
      <p className="info-page-subtitle">
        Track your orders and check their status
      </p>

      <div className="order-history-list">
        {orders.map((order) => (
          <div
            key={order.id}
            className="order-history-card"
            onClick={() => setSelectedOrder(order)}
          >
            <div className="order-history-header">
              <div>
                <p className="order-history-date">
                  {new Date(order.timestamp).toLocaleString()}
                </p>
                <p className="order-history-items">
                  {order.items?.map((i) => i.name).join(", ")}
                </p>
              </div>
              <div className="order-history-right">
                <p className="order-history-total">
                  RM {order.totalPrice?.toFixed(2)}
                </p>
                <span
                  className="order-history-badge"
                  style={{ background: STATUS_COLOR[order.status] || "#999" }}
                >
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Order Details</h2>
            <p style={{ color: "#666", marginBottom: "1rem" }}>
              {new Date(selectedOrder.timestamp).toLocaleString()}
            </p>

            <div className="order-details">
              <p>
                <strong>Order Status: </strong>
                <span
                  style={{
                    color: STATUS_COLOR[selectedOrder.status] || "#999",
                    fontWeight: 600,
                  }}
                >
                  {selectedOrder.status}
                </span>
              </p>
              <p>
                <strong>Payment: </strong>
                <span
                  style={{
                    color: PAYMENT_COLOR[selectedOrder.paymentStatus] || "#999",
                    fontWeight: 600,
                  }}
                >
                  {selectedOrder.paymentStatus}
                </span>
              </p>
              <p>
                <strong>Method:</strong>{" "}
                {selectedOrder.paymentMethodName || "—"}
              </p>
            </div>

            <div className="order-items" style={{ marginTop: "1rem" }}>
              <h3>Items</h3>
              {selectedOrder.items?.map((item) => (
                <div key={item.id} className="admin-item">
                  <span>{item.name}</span>
                  <span>× {item.quantity}</span>
                  <span>RM {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <p>Total: RM {selectedOrder.totalPrice?.toFixed(2)}</p>
            </div>

            <div className="modal-buttons">
              <button
                className="close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
