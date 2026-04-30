import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart]       = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const { user }              = useAuth();

  useEffect(() => {
    if (user) fetchCart();
    else setCart({ items: [], totalPrice: 0 });
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await getCart();
      setCart(res.data.cart);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId, quantity = 1) => {
    try {
      const res = await addToCart({ productId, quantity });
      setCart(res.data.cart);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add item');
    }
  };

  const updateItem = async (productId, quantity) => {
    try {
      const res = await updateCartItem({ productId, quantity });
      setCart(res.data.cart);
    } catch (err) {
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await removeFromCart(productId);
      setCart(res.data.cart);
      toast.success('Item removed');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const emptyCart = async () => {
    try {
      await clearCart();
      setCart({ items: [], totalPrice: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  const itemCount = cart?.items?.reduce((acc, i) => acc + i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, addItem, updateItem, removeItem, emptyCart, itemCount, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
