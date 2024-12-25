import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './App.css';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Homepage from './components/Homepage';
import NavbarComponent from './components/Navbar';
import Category from './components/category/[category]';
import BooksOnSale from './components/BooksOnSale';
import FooterComponent from './components/Footer';
import ShippingPolicy from './components/ShippingPolicy';
import PrivacyPolicy from './components/PrivacyPolicy';
import AboutUs from './components/AboutUs';
import SingleBook from './components/SingleBook';  
import Checkout from './components/checkout/index';
import Success from './success';

// Load your Stripe public key
const stripePromise = loadStripe('pk_test_51M8f0QSIyZmUPyzEStk6mtqlGJ3EAHttgidwMNH02NnoABEZZIQHom1AAyKbTD9QkOphHDdNexMaDI7KyPEhW5rK001mxUE9yu');

function App() {
  return (
    <Router>
      <div className="App">
        <NavbarComponent />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/books-on-sale" element={<BooksOnSale />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/category/:category" element={<Category />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/book/:bookId" element={<SingleBook />} />
          <Route 
            path="/checkout" 
            element={
              <Elements stripe={stripePromise}>
                <Checkout />
              </Elements>
            } 
          />
          <Route path='/success' element={Success}/>
        </Routes>
        <FooterComponent />
      </div>
    </Router>
  );
}

const Home = () => (
  <header className="App-header">
    <Homepage />
  </header>
);

export default App;
