import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import type { CartItem, Cake } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (cake: Cake) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  loadCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const API_URL = 'http://localhost:5001/api';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    
    const interval = setInterval(() => {
      setToken(localStorage.getItem('token'));
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (token) {
      loadCart();
    } else {
      setCart([]);
    }
  }, [token]);

  const loadCart = async () => {
    try {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) return;

      const response = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      
      const items = response.data.items.map((item: any) => ({
        id: item.cakeId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        description: item.description,
        category: item.category
      }));
      
      setCart(items);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const syncCart = async (updatedCart: CartItem[]) => {
    try {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) return;

      const items = updatedCart.map(item => ({
        cakeId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        description: item.description,
        category: item.category
      }));

      await axios.post(`${API_URL}/cart/sync`, 
        { items },
        { headers: { Authorization: `Bearer ${currentToken}` } }
      );
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  };

  const addToCart = (cake: Cake) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === cake.id);
      let newCart;
      
      if (existingItem) {
        newCart = prevCart.map(item =>
          item.id === cake.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...prevCart, { ...cake, quantity: 1 }];
      }
      
      syncCart(newCart);
      return newCart;
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.id !== id);
      syncCart(newCart);
      return newCart;
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCart(prevCart => {
      const newCart = prevCart.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      syncCart(newCart);
      return newCart;
    });
  };

  const clearCart = async () => {
    try {
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        await axios.delete(`${API_URL}/cart/clear`, {
          headers: { Authorization: `Bearer ${currentToken}` }
        });
      }
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      setCart([]);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
