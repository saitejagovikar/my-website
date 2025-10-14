import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart({ cart, updateCartQuantity, removeFromCart, user }) {
  const [showAlert, setShowAlert] = useState(false);
  const [itemToRemove, setItemToRemove] = useState({ id: null, size: null });
  const navigate = useNavigate();

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Use the cart prop directly instead of local state
  const cartItems = [...cart];
  
  const confirmRemove = (id, size) => {
    setItemToRemove({ id, size });
    setShowAlert(true);
  };

  const handleConfirmRemove = () => {
    removeFromCart(itemToRemove.id, itemToRemove.size);
    setShowAlert(false);
  };

  const handleCancelRemove = () => {
    setShowAlert(false);
  };

  const updateQuantity = (id, size, newQuantity) => {
    if (newQuantity <= 0) {
      confirmRemove(id, size);
    } else {
      updateCartQuantity(id, size, newQuantity);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price * (item.quantity || 1)),
    0
  );
  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleBack = () => {
    navigate("/");
  };

  const handleCheckout = () => {
    if (!user) {
      alert("Please login to proceed with checkout");
      navigate("/login", { state: { from: '/checkout' } });
      return;
    }
    navigate("/checkout");
  };

  // Compact alert component with blur effect
  const AlertDialog = () => (
    <div className="fixed inset-0 backdrop-blur-xs bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-4 max-w-xs w-full mx-4 shadow-lg border border-gray-100">
        <h3 className="text-lg font-medium mb-2" style={{ fontFamily: 'Marcellus SC, serif' }}>Remove Item</h3>
        <p className="text-sm text-gray-600 mb-4">Remove this item from your cart?</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancelRemove}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmRemove}
            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gray-50 py-8 relative ${showAlert ? 'overflow-hidden' : ''}`}>
      {showAlert && <AlertDialog />}
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-black hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">Continue Shopping</span>
          </button>

          <h1
            className="text-3xl font-bold text-black"
            style={{ fontFamily: "Marcellus SC, serif" }}
          >
            Shopping Cart
          </h1>

          <div className="text-sm text-gray-500">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </div>
        </div>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-12 h-12 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437
                  M7.5 14.25a3 3 0 0 0-3 3h15.75
                  m-12.75-3h11.218c1.121-2.3 2.1-4.684
                  2.924-7.138a60.114 60.114 0 0 0-16.536-1.84
                  M7.5 14.25 5.106 5.272
                  M6 20.25a.75.75 0 1 1-1.5 0
                  .75.75 0 0 1 1.5 0Zm12.75
                  0a.75.75 0 1 1-1.5 0
                  .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            </div>
            <h2
              className="text-2xl font-semibold text-gray-600 mb-2"
              style={{ fontFamily: "Marcellus SC, serif" }}
            >
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Add some items to get started
            </p>
            <button
              onClick={handleBack}
              className="bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors"
              style={{ fontFamily: "Marcellus SC, serif" }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div
                  key={`${item.id}-${item.size || 'default'}`}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      className="w-20 h-24 object-cover rounded-xl bg-gray-100"
                    />

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3
                        className="text-lg font-semibold text-black mb-1"
                        style={{ fontFamily: "Marcellus SC, serif" }}
                      >
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {item.description || "Premium quality tee"}
                      </p>
                      {item.size && (
                        <div className="flex items-center space-x-1 mb-2">
                          <span className="text-sm text-gray-600">Size:</span>
                          <span className="text-sm font-medium text-black">{item.size.toUpperCase()}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1 mb-2">
                        <span className="text-sm text-gray-600">Quantity:</span>
                        <span className="text-sm font-medium text-black">{item.quantity || 1}</span>
                      </div>

                      {/* Price and Quantity Controls */}
                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.size, (item.quantity || 1) - 1)
                            }
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 12H4"
                              />
                            </svg>
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.size, (item.quantity || 1) + 1)
                            }
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div
                            className="text-lg font-bold text-black"
                            style={{ fontFamily: "Marcellus SC, serif" }}
                          >
                            ₹{(item.price * (item.quantity || 1)).toLocaleString("en-IN")}
                          </div>
                          {(item.quantity || 1) > 1 && (
                            <div className="text-sm text-gray-500">
                              ₹{item.price.toLocaleString("en-IN")} each
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
                <h2
                  className="text-xl font-semibold text-black mb-6"
                  style={{ fontFamily: "Marcellus SC, serif" }}
                >
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>₹0</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-semibold text-black">
                      <span>Total</span>
                      <span>₹{total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-4 rounded-xl hover:bg-gray-800 transition-colors font-medium mb-4"
                >
                  Proceed to Checkout
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Secure checkout with SSL encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
