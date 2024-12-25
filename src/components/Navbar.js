import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const NavbarComponent = () => {
  const categories = ['Fiction', 'Non-fiction', 'Technology', 'Self-Help']; // List your categories here
  const [showCart, setShowCart] = useState(false); // State to toggle cart modal
  const [cartItems, setCartItems] = useState([]); // State to store cart items
  const navigate = useNavigate();

  useEffect(() => {
    handleGetCart();
  }, []);

  const handleCartToggle = () => {
    setShowCart(!showCart); // Toggle the cart modal
  };

  const handleGetCart = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/getCart');
      setCartItems([...response.data.cart.items]);
      console.log("Cart items ", [...response.data.cart.items])
    } catch (err) {
      console.log('err', err);
    }
  };

  const handleRemoveItem = async (bookId) => {
    console.log("BOOK to be removed", bookId)
    const confirmDelete = window.confirm('Do you want to remove this item from your cart?');
    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/removeFromCart/${bookId}`);
        if (response.status === 200) {
          setCartItems(cartItems.filter(item => item.book_id._id !== bookId));
        }
      } catch (err) {
        console.log('Error removing item:', err);
      }
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.book_id.price * item.quantity, 0);
  };

  function handleLogout() {
    // Remove the token from localStorage
    localStorage.removeItem('userToken');
    navigate('/');
  }

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand as={Link} to="/">Book a Book</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          {categories.map((category) => (
            <Nav.Link as={Link} key={category} to={`/category/${category}`}>
              {category}
            </Nav.Link>
          ))}
        </Nav>
        <Nav className="ms-auto">
          {!localStorage.getItem('userToken') && <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>}
          {!localStorage.getItem('userToken') && <Nav.Link as={Link} to="/signin">Sign In</Nav.Link>}
          {localStorage.getItem('userToken') && <Nav.Link as={Link} onClick={handleLogout}>Logout</Nav.Link>}
          <Nav.Link style={{ position: 'relative', cursor: 'pointer' }} onClick={handleCartToggle}>
            🛒 Cart
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>

      {/* Cart Modal */}
      {showCart && (
        <div
          style={{
            position: 'absolute',
            top: '60px', // Adjust as per Navbar height
            right: '20px',
            width: '320px',
            backgroundColor: '#f8f9fa', // Light grey background
            border: '1px solid #ddd',
            borderRadius: '5px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            padding: '15px'
          }}
        >
          <h5 style={{ textAlign: 'center' }}>Your Cart</h5>
          <hr />
          {cartItems.length > 0 ? (
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {cartItems.map((item) => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ width: '50%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.book_id.title}
                  </div>
                  <div style={{ width: '20%', textAlign: 'right' }}>
                    ${item.book_id.price.toFixed(2)}
                  </div>
                  <div style={{ width: '15%', textAlign: 'right' }}>
                    Qty: {item.quantity}
                  </div>
                  <div style={{ width: '10%', textAlign: 'right', cursor: 'pointer' }} onClick={() => handleRemoveItem(item.book_id._id)}>
                    🗑️ {/* Delete icon */}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Your cart is empty</p>
          )}

          <hr />
          <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
            Total: ${calculateTotal().toFixed(2)}
          </div>
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <button
              style={{
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={() => {
                setShowCart(false)
                navigate('/checkout'); }}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </Navbar>
  );
};

export default NavbarComponent;
