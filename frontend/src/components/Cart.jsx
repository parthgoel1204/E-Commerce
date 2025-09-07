// frontend/src/components/Cart.jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Cart = ({ onClose }) => {
  const { cart, loading, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
    } else {
      await updateQuantity(itemId, newQuantity);
    }
  };

  const getItemTotal = (item) => {
    const price = item.itemId?.price || item.price || 0;
    return (price * item.quantity).toFixed(2);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      <div className="flex-1 flex flex-col max-h-screen">
        <div className="flex-1 px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <nav className="text-gray-400 text-sm mb-2">
                <span>Home</span> <span className="mx-2">/</span> <span>Cart</span>
              </nav>
              <h1 className="text-3xl font-light text-white italic">Your Cart</h1>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : cart.items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">Your cart is empty</div>
              <button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-8 pb-4 border-b border-gray-700 mb-6">
                <div className="text-gray-300 font-medium">Product</div>
                <div className="text-gray-300 font-medium text-center">Price</div>
                <div className="text-gray-300 font-medium text-center">Quantity</div>
                <div className="text-gray-300 font-medium text-right">Total</div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 space-y-6 mb-8">
                {cart.items.map((item, index) => (
                  <div key={item.itemId?._id || index} className="grid grid-cols-4 gap-8 items-center py-4 border-b border-gray-800">
                    {/* Product */}
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.itemId?.image || item.image || 'https://via.placeholder.com/80x80/1f2937/ffffff?text=Product'}
                        alt={item.itemId?.title || item.itemId?.name || item.title || item.name || 'Product'}
                        className="w-16 h-16 object-cover rounded-lg bg-gray-800"
                      />
                      <div>
                        <h3 className="text-white font-medium text-base">
                          {item.itemId?.title || item.itemId?.name || item.title || item.name || 'Product'}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {item.itemId?.category || 'Product'}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.itemId?._id || item.itemId)}
                          className="text-gray-500 hover:text-red-400 text-sm transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-center">
                      <span className="text-white font-medium">
                        ${item.itemId?.price || item.price || 0}
                      </span>
                    </div>

                    {/* Quantity */}
                    <div className="flex justify-center">
                      <div className="flex items-center border border-gray-600 rounded">
                        <button
                          onClick={() => handleQuantityChange(item.itemId?._id || item.itemId, item.quantity - 1)}
                          className="text-gray-300 hover:text-white px-3 py-1 transition-colors"
                        >
                          −
                        </button>
                        <span className="text-white px-4 py-1 border-x border-gray-600 bg-gray-800 min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.itemId?._id || item.itemId, item.quantity + 1)}
                          className="text-gray-300 hover:text-white px-3 py-1 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="text-right">
                      <span className="text-white font-medium">
                        ${getItemTotal(item)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Section */}
              <div className="grid grid-cols-3 gap-8 mt-auto">
                {/* Delivery Info */}
                <div>
                  <h3 className="text-white font-medium mb-3">Delivery Info</h3>
                  <p className="text-gray-400 text-sm">
                    See our delivery & returns info here
                  </p>
                </div>

                {/* Subtotal - Centered */}
                <div className="flex flex-col items-center">
                  <div className="w-full max-w-sm">
                    <div className="text-center mb-4">
                      <div className="text-white text-xl font-medium mb-2">SUBTOTAL</div>
                      <div className="text-white text-2xl font-bold mb-2">
                        ${getCartTotal().toFixed(2)}
                      </div>
                      <p className="text-gray-400 text-sm">
                        Taxes and shipping calculated at checkout
                      </p>
                    </div>
                    
                    {/* Promo Code */}
                    <div className="mb-4">
                      <div className="flex">
                        <input
                          type="text"
                          placeholder="Add promo code"
                          className="flex-1 bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-l focus:outline-none focus:border-blue-500 text-sm"
                        />
                        <button className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-r transition-colors">
                          →
                        </button>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-2">
                      <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded font-medium transition-colors">
                        UPDATE
                      </button>
                      <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded font-medium transition-colors">
                        CHECKOUT
                      </button>
                    </div>
                  </div>
                </div>

                {/* Empty third column for balance */}
                <div></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
