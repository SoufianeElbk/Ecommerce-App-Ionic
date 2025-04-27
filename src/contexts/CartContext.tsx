import React, { createContext, useState, useContext, useEffect } from 'react';
import userData from '../data/user.json';
import productsData from '../data/products.json';

interface CartItem {
  productId: number;
  quantity: number;
  color?: string;
}

interface CartTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

interface CartContextType {
  items: CartItem[];
  totals: CartTotals;
  addToCart: (productId: number, quantity: number, color?: string) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  totals: {
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  },
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {}
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(userData.cart.items);
  const [totals, setTotals] = useState<CartTotals>(userData.cart.totals);

  const calculateTotals = (cartItems: CartItem[]) => {
    const subtotal = cartItems.reduce((sum, item) => {
      const product = productsData.find(p => p.id === item.productId);
      const price = product ? (product.discountPrice || product.price) : 0;
      return sum + (price * item.quantity);
    }, 0);
    
    const shipping = subtotal > 100 ? 0 : 5.99;
    const tax = subtotal * 0.085;
    
    return {
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax
    };
  };

  const addToCart = (productId: number, quantity: number, color?: string) => {
    const existingItem = items.find(item => item.productId === productId && item.color === color);
    
    if (existingItem) {
      const updatedItems = items.map(item => 
        item.productId === productId && item.color === color
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      setItems(updatedItems);
    } else {
      setItems([...items, { productId, quantity, color }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setItems(items.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(items.map(item => 
      item.productId === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setItems([]);
  };

  useEffect(() => {
    setTotals(calculateTotals(items));
  }, [items]);

  return (
    <CartContext.Provider value={{
      items,
      totals,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}; 