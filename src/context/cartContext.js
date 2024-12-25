import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the Cart Context
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch cart items from the API
  const fetchCartItems = async () => {
    try {
      const response = await axios.get('/api/getCart'); // Replace with your actual API route
      if (response.data && response.data.items) {
        setCartItems(response.data.items); // Assuming the response has an `items` array
      }
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the cart items when the component mounts
  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, loading }}>
      {loading ? <p>Loading cart...</p> : children}
    </CartContext.Provider>
  );
};
