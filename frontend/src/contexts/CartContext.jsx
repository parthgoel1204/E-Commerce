// frontend/src/contexts/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Load cart when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCart();
    } else {
      // Load cart from localStorage for guest users
      const guestCart = localStorage.getItem('guestCart');
      if (guestCart) {
        setCart(JSON.parse(guestCart));
      }
    }
  }, [isAuthenticated, user]);

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await api.get('/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (itemId, quantity = 1, productData = null) => {
    try {
      setLoading(true);
      
      if (isAuthenticated) {
        // Add to server cart
        const response = await api.post('/cart', { itemId, quantity });
        setCart(response.data);
      } else {
        // Add to guest cart in localStorage
        const updatedCart = { ...cart };
        const existingItemIndex = updatedCart.items.findIndex(item => 
          (item.itemId === itemId) || (item.itemId?._id === itemId)
        );
        
        if (existingItemIndex !== -1) {
          updatedCart.items[existingItemIndex].quantity += quantity;
        } else {
          // Store product data for guest cart
          updatedCart.items.push({ 
            itemId: productData || itemId, 
            quantity 
          });
        }
        
        setCart(updatedCart);
        localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to add to cart' };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      
      if (isAuthenticated) {
        // Remove from server cart
        const response = await api.delete(`/cart/${itemId}`);
        setCart(response.data);
      } else {
        // Remove from guest cart in localStorage
        const updatedCart = { ...cart };
        updatedCart.items = updatedCart.items.filter(item => 
          (item.itemId !== itemId) && (item.itemId?._id !== itemId)
        );
        
        setCart(updatedCart);
        localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to remove from cart' };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(itemId);
    }
    
    try {
      setLoading(true);
      
      if (isAuthenticated) {
        // Update server cart
        await removeFromCart(itemId);
        await addToCart(itemId, quantity);
      } else {
        // Update guest cart in localStorage
        const updatedCart = { ...cart };
        const itemIndex = updatedCart.items.findIndex(item => item.itemId === itemId);
        
        if (itemIndex !== -1) {
          updatedCart.items[itemIndex].quantity = quantity;
          setCart(updatedCart);
          localStorage.setItem('guestCart', JSON.stringify(updatedCart));
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error updating quantity:', error);
      return { success: false, error: 'Failed to update quantity' };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCart({ items: [] });
    localStorage.removeItem('guestCart');
  };

  const getCartItemCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.items.reduce((total, item) => {
      // Handle both populated (server) and unpopulated (guest) cart items
      const price = item.itemId?.price || item.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      fetchCart,
      getCartItemCount,
      getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
