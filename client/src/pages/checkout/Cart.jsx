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
        <div className="relative flex items-center justify-between mb-6 md:mb-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-black hover:text-gray-600 transition-colors z-10"
          >
            <svg
              className="w-5 h-5 md:w-5 md:h-5"
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
            <span className="font-medium text-sm md:text-base hidden md:inline">Continue Shopping</span>
          </button>

          <h1
            className="absolute left-1/2 transform -translate-x-1/2 text-2xl md:text-3xl font-bold text-black md:static md:transform-none"
            style={{ fontFamily: "Marcellus SC, serif" }}
          >
            shopping cart
          </h1>

          <div className="text-xs md:text-sm text-gray-500 z-10">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </div>
        </div>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-10 h-10 md:w-12 md:h-12 text-gray-400"
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
              className="text-xl md:text-2xl font-semibold text-gray-600 mb-2"
              style={{ fontFamily: "Marcellus SC, serif" }}
            >
              Your cart is empty
            </h2>
            <p className="text-sm md:text-base text-gray-500 mb-6">
              Add some items to get started
            </p>
            <button
              onClick={handleBack}
              className="bg-black text-white px-6 py-2.5 md:px-8 md:py-3 text-sm md:text-base rounded-xl hover:bg-gray-800 transition-colors"
              style={{ fontFamily: "Marcellus SC, serif" }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {/* Scrollable container for cart items */}
              <div className="space-y-3 md:space-y-4 max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-250px)] overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
                {cartItems.map(item => (
                  <div
                    key={`${item.id}-${item.size || 'default'}`}
                    className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-3 md:space-x-4">
                      {/* Product Image */}
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        className="w-16 h-20 md:w-20 md:h-24 object-cover rounded-lg md:rounded-xl bg-gray-100 flex-shrink-0"
                      />

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3
                              className="text-base md:text-lg font-semibold text-black mb-0.5 md:mb-1 truncate pr-2"
                              style={{ fontFamily: "Marcellus SC, serif" }}
                            >
                              {item.name}
                            </h3>
                            <p className="text-xs md:text-sm text-gray-500 mb-1.5 md:mb-2 line-clamp-1">
                              {item.description || "Premium quality tee"}
                            </p>
                          </div>
                          {/* Price specific for mobile layout optimization */}
                          <div className="text-base md:text-lg font-bold text-black md:hidden">
                            ₹{(item.price * (item.quantity || 1)).toLocaleString("en-IN")}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2 text-xs md:text-sm">
                          {item.size && (
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-600">Size:</span>
                              <span className="font-medium text-black">{item.size.toUpperCase()}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-600">Qty:</span>
                            <span className="font-medium text-black">{item.quantity || 1}</span>
                          </div>
                        </div>

                        {/* Controls Row */}
                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.size, (item.quantity || 1) - 1)
                              }
                              className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <svg
                                className="w-3 h-3 md:w-4 md:h-4"
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
                            <span className="w-6 md:w-8 text-center font-medium text-sm md:text-base">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.size, (item.quantity || 1) + 1)
                              }
                              className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <svg
                                className="w-3 h-3 md:w-4 md:h-4"
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

                          {/* Desktop Price */}
                          <div className="text-right hidden md:block">
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

                          {/* Mobile Remove Button (Optional) */}
                          <button
                            onClick={() => confirmRemove(item.id, item.size)}
                            className="text-xs text-red-500 font-medium md:hidden ml-auto underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Scroll indicator */}
              {cartItems.length > 3 && (
                <div className="text-center mt-3 md:mt-4 text-xs md:text-sm text-gray-500">
                  Scroll for more
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 sticky top-20 md:top-8">
                <h2
                  className="text-lg md:text-xl font-semibold text-black mb-4 md:mb-6"
                  style={{ fontFamily: "Marcellus SC, serif" }}
                >
                  Order Summary
                </h2>

                <div className="space-y-3 md:space-y-4 mb-6">
                  <div className="flex justify-between text-sm md:text-base text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base text-gray-600">
                    <span>Tax</span>
                    <span>₹0</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 md:pt-4">
                    <div className="flex justify-between text-base md:text-lg font-semibold text-black">
                      <span>Total</span>
                      <span>₹{total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-3 md:py-4 rounded-xl hover:bg-gray-800 transition-colors font-medium text-sm md:text-base mb-3 md:mb-4"
                  style={{ fontFamily: "Marcellus SC, serif" }}
                >
                  Proceed to Checkout
                </button>

                <div className="text-center">
                  <p className="text-xs md:text-sm text-gray-500">
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
