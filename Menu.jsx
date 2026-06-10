import { useState, useEffect } from "react";
import { PAYMENT_METHODS, MENU_DATA, IMAGE_MAP } from "../constants";

const imageMap = IMAGE_MAP;

export default function ShoppingCart({ currentUser }) {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  // check local storage data that user got add to cart or not if not leave if empty if got data will show in the cart page
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    setMenu(MENU_DATA);
  }, []);
  //if they press add button the item will show at the cart page if they want to increase the quantity, the quantity will +1
  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        ),
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };
  //remove cart
  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };
  //if they choose new item the quantity will be updated, if it's zero or less, remove from cart
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(
      cart.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
    );
  };
  //calculate the total price of the cart
  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };
  //when they click submit order, make sure that the user input detail if not will show alert and if done detail it will pop out payment method
  const submitOrder = () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }
    if (!customerName.trim()) {
      alert("Please enter your name!");
      return;
    }
    setShowPaymentModal(true);
  };

  const completeOrderWithPayment = (paymentMethod) => {
    try {
      const orders = JSON.parse(localStorage.getItem("orders")) || [];
      const newOrder = {
        id: Date.now(),
        userId: currentUser?.id,
        customerName,
        customerPhone,
        items: cart,
        totalPrice: parseFloat(calculateTotal()), // total price of the order
        timestamp: new Date().toISOString(),
        status: "Pending",
        paymentMethod: paymentMethod.id,
        paymentMethodName: paymentMethod.name,
        paymentStatus: "Pending Payment", // will send to admin to update the payment status
        paidAt: null,
      };
      orders.push(newOrder);
      localStorage.setItem("orders", JSON.stringify(orders));
      setShowPaymentModal(false);
      setSelectedPayment(null);
      setShowSuccess(true);
      setTimeout(() => {
        setCart([]);
        setCustomerName("");
        setCustomerPhone("");
        localStorage.setItem("cart", "[]");
        setShowSuccess(false);
      }, 3000); // after submit finish submiting order the cart will be auto clear within 3 second
    } catch (error) {
      alert("Error submitting order: " + error.message);
    }
  };
  // right size menu page , when the user order or add item it will push to the cart page automatically
  const groupedMenu = {};
  menu.forEach((item) => {
    if (!groupedMenu[item.category]) {
      groupedMenu[item.category] = [];
    }
    groupedMenu[item.category].push(item);
  });
  // seperate the menu into different category and show the fixed prices in the menu page with the image to let user easy to use and known every food category easily
  return (
    <div className="shopping-cart-container">
      <div className="menu-section">
        <h2 className="section-title"> Our Mamak Menu</h2>
        {Object.entries(groupedMenu).map(([category, items]) => (
          <div key={category} className="category-section">
            <h3 className="category-title">{category}</h3>
            <div className="menu-grid">
              {items.map((item) => (
                <div key={item.id} className="menu-item">
                  <div className="menu-item-image">
                    <img
                      src={`/images/${imageMap[item.image]}`}
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
                    <div className="menu-item-footer">
                      <span className="price">RM {item.price.toFixed(2)}</span>
                      <button
                        className="add-btn"
                        onClick={() => addToCart(item)}
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* After input finished it will pop out grand total and payment options */}
      <div className="cart-section">
        <h2 className="cart-title">Your Order</h2>
        {showSuccess && (
          <div className="success-message">
            ✅ Order submitted successfully!
          </div>
        )}

        {showPaymentModal && (
          <div
            className="payment-modal-overlay"
            onClick={() => setShowPaymentModal(false)}
          >
            <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="payment-title">Select Payment Method</h2>
              <p className="payment-subtitle">
                Order Total: <strong>RM {calculateTotal()}</strong>
              </p>
              <div className="payment-methods">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    className={`payment-method-btn ${selectedPayment?.id === method.id ? "selected" : ""}`}
                    onClick={() => setSelectedPayment(method)}
                    style={{
                      borderColor:
                        selectedPayment?.id === method.id
                          ? method.color
                          : "#ddd",
                    }}
                  >
                    <img
                      className="payment-icon"
                      src={method.icon}
                      alt={method.name}
                    />
                    <span className="payment-name">{method.name}</span>
                    <span className="payment-desc">{method.description}</span>
                  </button>
                ))}
              </div>
              {/* if they dont select any payment method it will be disabled  or when they forgot to add some items inside the user can press cancal button and continue ordering */}
              <div className="payment-modal-buttons">
                <button
                  className="pay-btn"
                  onClick={() => {
                    if (!selectedPayment) {
                      alert("Please select a payment method!");
                      return;
                    }
                    completeOrderWithPayment(selectedPayment);
                  }}
                  disabled={!selectedPayment}
                >
                  Pay Now
                </button>
                <button
                  className="cancel-payment-btn"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPayment(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {/* If the cart is empty it will tell you to add items before to submit an order */}
        {/* It also can edit the quantity of the item that u order in the cart */}
        {cart.length === 0 ? (
          <p className="empty-cart">Your cart is empty. Add items to begin!</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <h5>{item.name}</h5>
                  </div>
                  <div className="cart-item-controls">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value) || 1)
                      }
                      className="qty-input"
                    />
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-item-price">
                    <p>RM {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            {/* Total quantity and will show u the grand total  */}
            <div className="cart-total">
              <h3>Total: RM {calculateTotal()}</h3>
            </div>
            <div className="customer-info">
              {/* Name and phone number must filled in */}
              <input
                type="text"
                placeholder="Your Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="info-input"
              />
              <input
                type="tel"
                placeholder="Phone Number (optional)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="info-input"
              />
            </div>
            {/* Submit button for placing the order to let admin know what u order */}
            <button className="submit-btn" onClick={submitOrder}>
              Proceed to Payment
            </button>
          </>
        )}
      </div>
    </div>
  );
}
