import { useState, useEffect } from "react";
import "./App.css";
import logo from "./assets/download (53).png";
import HomePage from "./pages/Home";
import MenuPage from "./pages/Menu";
import PaymentPage from "./pages/Payment";
import AboutPage from "./pages/About";
import { MENU_DATA, IMAGE_MAP } from "./constants";

// ── Auth helpers ──────────────────────────────────────────────────────────────

const ADMIN_EMAIL = "junschuah@gmail.com";
const ADMIN_PASSWORD = "960311Cc@";

function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getSession() {
  return JSON.parse(localStorage.getItem("currentUser") || "null");
}

function saveSession(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem("currentUser");
}

// ── AuthPage (Login + Register) ───────────────────────────────────────────────

function AuthPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [view, setView] = useState("auth"); // "auth" | "forgot"

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Register
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regError, setRegError] = useState("");

  // Forgot password
  const [fpStep, setFpStep] = useState(1); // 1 = verify email, 2 = new password, "done" = success
  const [fpEmail, setFpEmail] = useState("");
  const [fpFoundUser, setFpFoundUser] = useState(null);
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpConfirm, setFpConfirm] = useState("");
  const [fpError, setFpError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");
    if (loginEmail === ADMIN_EMAIL && loginPassword === ADMIN_PASSWORD) {
      const admin = { id: "admin", name: "Admin", email: ADMIN_EMAIL, role: "admin" };
      saveSession(admin);
      onLogin(admin);
      return;
    }
    const users = getUsers();
    const user = users.find(
      (u) => u.email === loginEmail && u.password === loginPassword
    );
    if (user) {
      const session = { id: user.id, name: user.name, email: user.email, role: "user" };
      saveSession(session);
      onLogin(session);
    } else {
      setLoginError("Invalid email or password.");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setRegError("");
    if (regPassword !== regConfirm) {
      setRegError("Passwords do not match.");
      return;
    }
    if (regPassword.length < 6) {
      setRegError("Password must be at least 6 characters.");
      return;
    }
    const users = getUsers();
    if (users.find((u) => u.email === regEmail)) {
      setRegError("An account with this email already exists.");
      return;
    }
    const newUser = {
      id: Date.now().toString(),
      name: regName,
      email: regEmail,
      password: regPassword,
    };
    saveUsers([...users, newUser]);
    const session = { id: newUser.id, name: newUser.name, email: newUser.email, role: "user" };
    saveSession(session);
    onLogin(session);
  };

  const handleFpVerify = (e) => {
    e.preventDefault();
    setFpError("");
    if (fpEmail === ADMIN_EMAIL) {
      setFpError("Password reset is not available for this account.");
      return;
    }
    const users = getUsers();
    const user = users.find((u) => u.email === fpEmail);
    if (!user) {
      setFpError("No account found with this email.");
      return;
    }
    setFpFoundUser(user);
    setFpStep(2);
  };

  const handleFpReset = (e) => {
    e.preventDefault();
    setFpError("");
    if (fpNewPassword !== fpConfirm) {
      setFpError("Passwords do not match.");
      return;
    }
    if (fpNewPassword.length < 6) {
      setFpError("Password must be at least 6 characters.");
      return;
    }
    const users = getUsers();
    saveUsers(users.map((u) =>
      u.id === fpFoundUser.id ? { ...u, password: fpNewPassword } : u
    ));
    setFpStep("done");
  };

  const backToLogin = () => {
    setView("auth");
    setTab("login");
    setFpStep(1);
    setFpEmail("");
    setFpNewPassword("");
    setFpConfirm("");
    setFpError("");
    setFpFoundUser(null);
  };

  if (view === "forgot") {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-logo">
            <img src={logo} alt="Mr Mamak" />
          </div>
          <h2 className="auth-title">Reset Password</h2>
          <p className="auth-subtitle">
            {fpStep === 1 ? "Enter your email to find your account" : fpStep === 2 ? "Create a new password" : ""}
          </p>

          {fpStep !== "done" && (
            <div className="auth-reset-steps">
              <div className={`auth-step${fpStep >= 1 ? " active" : ""}`}>
                <span className="auth-step-num">1</span>
                Verify Email
              </div>
              <div className="auth-step-line" />
              <div className={`auth-step${fpStep >= 2 ? " active" : ""}`}>
                <span className="auth-step-num">2</span>
                New Password
              </div>
            </div>
          )}

          {fpStep === 1 && (
            <form className="auth-form" onSubmit={handleFpVerify}>
              <div className="auth-field">
                <label>Email Address</label>
                <input
                  className="auth-input"
                  type="email"
                  value={fpEmail}
                  onChange={(e) => setFpEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  required
                />
              </div>
              {fpError && <div className="auth-error">{fpError}</div>}
              <button className="auth-btn" type="submit">
                Verify Email
              </button>
              <button type="button" className="auth-back-link" onClick={backToLogin}>
                ← Back to Login
              </button>
            </form>
          )}

          {fpStep === 2 && (
            <form className="auth-form" onSubmit={handleFpReset}>
              <div className="auth-reset-verified">
                ✓ Account found: {fpFoundUser.name}
              </div>
              <div className="auth-field">
                <label>New Password</label>
                <input
                  className="auth-input"
                  type="password"
                  value={fpNewPassword}
                  onChange={(e) => setFpNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                />
              </div>
              <div className="auth-field">
                <label>Confirm New Password</label>
                <input
                  className="auth-input"
                  type="password"
                  value={fpConfirm}
                  onChange={(e) => setFpConfirm(e.target.value)}
                  placeholder="Re-enter your new password"
                  required
                />
              </div>
              {fpError && <div className="auth-error">{fpError}</div>}
              <button className="auth-btn" type="submit">
                Update Password
              </button>
              <button type="button" className="auth-back-link" onClick={backToLogin}>
                ← Back to Login
              </button>
            </form>
          )}

          {fpStep === "done" && (
            <div className="auth-reset-success">
              <div className="auth-success-icon">✅</div>
              <h3>Password Updated!</h3>
              <p>Your password has been successfully reset. You can now log in with your new password.</p>
              <button className="auth-btn" onClick={backToLogin}>
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <img src={logo} alt="Mr Mamak" />
        </div>
        <h2 className="auth-title">Welcome to Mr Mamak</h2>
        <p className="auth-subtitle">Sign in or create an account to continue</p>

        <div className="auth-tabs">
          <button
            className={`auth-tab${tab === "login" ? " active" : ""}`}
            onClick={() => {
              setTab("login");
              setLoginError("");
            }}
          >
            Login
          </button>
          <button
            className={`auth-tab${tab === "register" ? " active" : ""}`}
            onClick={() => {
              setTab("register");
              setRegError("");
            }}
          >
            Register
          </button>
        </div>

        {tab === "login" ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-field">
              <label>Email</label>
              <input
                className="auth-input"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input
                className="auth-input"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="auth-forgot-link"
                onClick={() => {
                  setView("forgot");
                  setLoginError("");
                }}
              >
                Forgot password?
              </button>
            </div>
            {loginError && <div className="auth-error">{loginError}</div>}
            <button className="auth-btn" type="submit">
              Login
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="auth-field">
              <label>Full Name</label>
              <input
                className="auth-input"
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="auth-field">
              <label>Email</label>
              <input
                className="auth-input"
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input
                className="auth-input"
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
              />
            </div>
            <div className="auth-field">
              <label>Confirm Password</label>
              <input
                className="auth-input"
                type="password"
                value={regConfirm}
                onChange={(e) => setRegConfirm(e.target.value)}
                placeholder="Re-enter your password"
                required
              />
            </div>
            {regError && <div className="auth-error">{regError}</div>}
            <button className="auth-btn" type="submit">
              Create Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────

function Navbar({ currentView, setCurrentView, currentUser, onLogout }) {
  return (
    <nav className={`App${currentView === "home" ? " nav-blur" : ""}`}>
      <img src={logo} alt="Mr Mamak Logo" />
      <div className="nav-links">
        <a
          href="#"
          className={currentView === "home" ? "active" : ""}
          onClick={(e) => {
            e.preventDefault();
            setCurrentView("home");
          }}
        >
          Home
        </a>
        <a
          href="#"
          className={currentView === "menu" ? "active" : ""}
          onClick={(e) => {
            e.preventDefault();
            setCurrentView("menu");
          }}
        >
          Menu
        </a>
        <a
          href="#"
          className={currentView === "payment" ? "active" : ""}
          onClick={(e) => {
            e.preventDefault();
            setCurrentView("payment");
          }}
        >
          Order History
        </a>
        <a
          href="#"
          className={currentView === "about" ? "active" : ""}
          onClick={(e) => {
            e.preventDefault();
            setCurrentView("about");
          }}
        >
          About
        </a>
      </div>
      <div className="nav-user">
        <span className="nav-user-name">Hi, {currentUser.name}</span>
        <button className="nav-logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

// ── CostsPage ─────────────────────────────────────────────────────────────────

function CostsPage() {
  const grouped = {};
  MENU_DATA.forEach((item) => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });

  return (
    <div className="admin-container">
      <h1>Food & Drink Costs</h1>
      <div className="menu-section">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="category-section">
            <h3 className="category-title">{category}</h3>
            <div className="menu-grid">
              {items.map((item) => {
                const profit = item.price - item.cost;
                return (
                  <div key={item.id} className="menu-item">
                    <div className="menu-item-image">
                      <img
                        src={`/images/${IMAGE_MAP[item.image]}`}
                        alt={item.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                    <div className="menu-item-content">
                      <h4>{item.name}</h4>
                      <p className="description">{item.description}</p>
                      <div className="cost-breakdown">
                        <div className="cost-row">
                          <span>Selling Price</span>
                          <span className="cost-selling">
                            RM {item.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="cost-row">
                          <span>Ingredient Cost</span>
                          <span className="cost-value">
                            RM {item.cost.toFixed(2)}
                          </span>
                        </div>
                        <div className="cost-row cost-profit-row">
                          <span>Profit</span>
                          <span className="cost-profit">
                            RM {profit.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── AdminPage ─────────────────────────────────────────────────────────────────

function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    setOrders(JSON.parse(localStorage.getItem("orders")) || []);
  }, []);

  const saveOrders = (updated) => {
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  const updateStatus = (orderId, status) => {
    saveOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)));
    if (selectedOrder?.id === orderId)
      setSelectedOrder((prev) => ({ ...prev, status }));
  };

  const updatePaymentStatus = (orderId, paymentStatus) => {
    const paidAt = paymentStatus === "Paid" ? new Date().toISOString() : null;
    saveOrders(
      orders.map((o) =>
        o.id === orderId ? { ...o, paymentStatus, paidAt } : o
      )
    );
    if (selectedOrder?.id === orderId)
      setSelectedOrder((prev) => ({ ...prev, paymentStatus, paidAt }));
  };

  const deleteOrder = (orderId) => {
    if (!window.confirm("Delete this order?")) return;
    saveOrders(orders.filter((o) => o.id !== orderId));
    setSelectedOrder(null);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const totalCost = orders.reduce(
    (sum, o) =>
      sum +
      (o.items || []).reduce(
        (s, item) => s + (item.cost || 0) * item.quantity,
        0
      ),
    0
  );
  const netProfit = totalRevenue - totalCost;
  const pendingCount = orders.filter((o) => o.status === "Pending").length;

  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-number">{orders.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-number">RM {totalRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p className="stat-number">{pendingCount}</p>
        </div>
        <div className="stat-card">
          <h3>Net Profit</h3>
          <p
            className="stat-number"
            style={{ color: netProfit >= 0 ? "#22c55e" : "#ef4444" }}
          >
            RM {netProfit.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="orders-section">
        <h2>All Orders</h2>
        {orders.length === 0 ? (
          <p style={{ color: "#999", textAlign: "center" }}>No orders yet.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div
                key={order.id}
                className="order-card"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="order-header">
                  <h4>{order.customerName}</h4>
                  <span className={`status ${order.status?.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                <p>{order.items?.length} item(s)</p>
                <p className="order-total">RM {order.totalPrice?.toFixed(2)}</p>
                <p>{new Date(order.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Order — {selectedOrder.customerName}</h2>
            <div className="order-details">
              <p>
                <strong>Phone:</strong> {selectedOrder.customerPhone || "—"}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedOrder.timestamp).toLocaleString()}
              </p>
              <p>
                <strong>Status: </strong>
                <select
                  className="status-select"
                  value={selectedOrder.status}
                  onChange={(e) =>
                    updateStatus(selectedOrder.id, e.target.value)
                  }
                >
                  {["Pending", "Completed"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </p>
            </div>

            <div className="payment-section">
              <h3>Payment</h3>
              <div className="payment-info-box">
                <p>
                  <strong>Method:</strong>{" "}
                  {selectedOrder.paymentMethodName || "—"}
                </p>
                <p>
                  <strong>Status: </strong>
                  <select
                    className="payment-status-select"
                    value={selectedOrder.paymentStatus}
                    onChange={(e) =>
                      updatePaymentStatus(selectedOrder.id, e.target.value)
                    }
                  >
                    {[
                      "Pending Payment",
                      "Paid",
                      "Payment Failed",
                      "Refunded",
                    ].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </p>
                {selectedOrder.paidAt && (
                  <p>
                    <strong>Paid At:</strong>{" "}
                    {new Date(selectedOrder.paidAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <div className="order-items">
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
                className="delete-order-btn"
                onClick={() => deleteOrder(selectedOrder.id)}
              >
                Delete Order
              </button>
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

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => getSession());
  const [currentView, setCurrentView] = useState("home");
  const [adminView, setAdminView] = useState("dashboard");

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
    setCurrentView("home");
    setAdminView("dashboard");
  };

  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} />;
  }

  if (currentUser.role === "admin") {
    return (
      <>
        <nav className="App">
          <img src={logo} alt="Mr Mamak Logo" />
          <div className="nav-links">
            <a
              href="#"
              className={adminView === "dashboard" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setAdminView("dashboard");
              }}
            >
              Dashboard
            </a>
            <a
              href="#"
              className={adminView === "costs" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setAdminView("costs");
              }}
            >
              Costs
            </a>
          </div>
          <div className="nav-user">
            <span className="nav-user-name">Hi, Admin</span>
            <button className="nav-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>
        {adminView === "dashboard" ? <AdminPage /> : <CostsPage />}
      </>
    );
  }

  return (
    <>
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      {currentView === "home" && <HomePage setCurrentView={setCurrentView} />}
      {currentView === "menu" && <MenuPage />}
      {currentView === "payment" && <PaymentPage />}
      {currentView === "about" && <AboutPage />}
    </>
  );
}
