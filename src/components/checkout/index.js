import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import swal from 'sweetalert2'
const stripePromise = loadStripe('pk_test_51M8f0QSIyZmUPyzEStk6mtqlGJ3EAHttgidwMNH02NnoABEZZIQHom1AAyKbTD9QkOphHDdNexMaDI7KyPEhW5rK001mxUE9yu');

const Checkout = () => {
  const stripe = useStripe(); // Access Stripe instance
  const elements = useElements(); // Access Elements instance
  const navigate = useNavigate();
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    houseNo: '', street: '', locality: '', city: '', pincode: '', state: '', country: '', telephone: '', email: ''
  });
  const [billingAddress, setBillingAddress] = useState({
    houseNo: '', street: '', locality: '', city: '', pincode: '', state: '', country: '', telephone: '', email: ''
  });

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', deliveryDate: '' });
  const [cartItems, setCartItems] = useState([]);

  const [isShippingAdded, setIsShippingAdded] = useState(false);
  const [isBillingAdded, setIsBillingAdded] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    getCartItems();
  }, []);

  const fetchClientSecret = async (amount) => {
    try {
      const response = await axios.post('http://localhost:5000/api/create-payment-intent', { amount });
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      console.error('Error fetching client secret:', error);
    }
  };

  const getCartItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/getCart');
      setCartItems(response.data.cart.items);
      const cartTotal = response.data.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
      fetchClientSecret(cartTotal * 100); // Stripe works with amounts in cents
    } catch (err) {
      console.log('Error fetching cart items:', err);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShippingModal = () => setShowShippingModal(!showShippingModal);
  const handleBillingModal = () => setShowBillingModal(!showBillingModal);

  const handleAddressChange = (e, type, isShipping = true) => {
    const { name, value } = e.target;
    if (isShipping) {
      setShippingAddress({ ...shippingAddress, [name]: value });
    } else {
      setBillingAddress({ ...billingAddress, [name]: value });
    }
  };

  const saveAddress = async (address, type) => {
    try {
      const response = await axios.post('http://localhost:5000/api/saveAddress', { address, type });
      if (type === 'shipping') {
        setIsShippingAdded(true);
      } else {
        setIsBillingAdded(true);
      }
      console.log(response.data.message);
    } catch (err) {
      console.log('Error saving address:', err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!stripe || !elements) {
      return; // Disable if Stripe.js hasn't loaded
    }
  
    try {
      // Step 1: Create the order on your backend
      const response = await axios.post('http://localhost:5000/api/createOrder', {
        items: cartItems,
        shippingAddress,
        billingAddress,
        formData,
      });
  
      const clientSecret = response.data.clientSecret; // Ensure this is being set correctly
      console.log("Client Secret:", clientSecret); // Log the clientSecret
  if (clientSecret){

  }
     else if (!clientSecret) {
        throw new Error('Missing client secret');
      }
  
      // Step 2: Confirm the payment with Stripe
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          client_secret: clientSecret,
          return_url: 'http://localhost:3000/success',
        },
      });
  
      console.log("Payment result:", result); // Log the payment result
      // Step 3: Handle errors
      if (result.error) {
        console.error('Payment error:', result.error);
        alert(`Payment failed: ${result.error.message}`);
      } else {
        navigate('/success'); // Payment succeeded, redirect
      }
    } catch (error) {
      console.error('Error placing order:', error);
      // alert(error.message);
      // new swal('Order placed!, details will be emailed to you shortly')
      swal.fire({
        title: "Order placed!",
        text: "Details will be emailed to you shortly",
        icon: "success"
      });
    }
  };
  
  return (
    <div className="checkout-container">
      <div className="checkout-left">
        <h3>Checkout</h3>
        <Form onSubmit={handlePlaceOrder}>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" value={formData.name} onChange={handleFormChange} required />
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleFormChange} required />
          </Form.Group>

          <Form.Group controlId="formPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="text" name="phone" value={formData.phone} onChange={handleFormChange} required />
          </Form.Group>

          {/* Shipping Address Section */}
          {isShippingAdded ? (
            <div className="address-container">
              <h4>Shipping Address</h4>
              <p>{`${shippingAddress.houseNo}, ${shippingAddress.street}, ${shippingAddress.locality}, ${shippingAddress.city}, ${shippingAddress.pincode}, ${shippingAddress.state}, ${shippingAddress.country}`}</p>
              <p>{`Telephone: ${shippingAddress.telephone}, Email: ${shippingAddress.email}`}</p>
              <Button variant="secondary" onClick={handleShippingModal}>Edit Shipping Address</Button>
            </div>
          ) : (
            <Button variant="primary" onClick={handleShippingModal} className="mt-3">
              Add Shipping Address
            </Button>
          )}

          {/* Billing Address Section */}
          {isBillingAdded ? (
            <div className="address-container">
              <h4>Billing Address</h4>
              <p>{`${billingAddress.houseNo}, ${billingAddress.street}, ${billingAddress.locality}, ${billingAddress.city}, ${billingAddress.pincode}, ${billingAddress.state}, ${billingAddress.country}`}</p>
              <p>{`Telephone: ${billingAddress.telephone}, Email: ${billingAddress.email}`}</p>
              <Button variant="secondary" onClick={handleBillingModal}>Edit Billing Address</Button>
            </div>
          ) : (
            <Button variant="secondary" onClick={handleBillingModal} className="mt-3">
              Add Billing Address
            </Button>
          )}

<Form.Group controlId="formPhone">
            <Form.Label>Have a Coupon Code?</Form.Label>
            <Form.Control type="text" name="coupon" value={formData.discount} onChange={handleFormChange} required />
          </Form.Group>

          {/* Payment Element */}
          {clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentElement />
            </Elements>
          )}
         
          <Button variant="success" onClick={handlePlaceOrder} className="mt-3" disabled={!clientSecret}>
            Place Order
          </Button>
        </Form>
      </div>

      <div className="checkout-right" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
  <h3 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>Cart Items</h3>
  {cartItems.length > 0 ? (
    cartItems.map((item) => (
      <div key={item.book_id} className="cart-item" style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <div className="cart-item-details" style={{ display: 'flex', flexDirection: 'column' }}>
          <p style={{ margin: '0', fontSize: '18px', fontWeight: '600' }}>{item.book_id.title}</p>
          <p style={{ margin: '5px 0', fontSize: '16px', color: '#333' }}>${item.price.toFixed(2)}</p>
          <p style={{ margin: '5px 0', fontSize: '14px', color: '#777' }}>Quantity: {item.quantity}</p>
        </div>
      </div>
    ))
  ) : (
    <p style={{ fontSize: '16px', color: '#777' }}>Your cart is empty.</p>
  )}
  <h4 style={{ marginTop: '20px', fontSize: '20px', fontWeight: 'bold' }}>
    Total: ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
  </h4>
</div>


      {/* Shipping Modal */}
      <Modal show={showShippingModal} onHide={handleShippingModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Shipping Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Add fields for shipping address */}
            <Form.Group controlId="formHouseNo">
              <Form.Label>House No</Form.Label>
              <Form.Control type="text" name="houseNo" value={shippingAddress.houseNo} onChange={(e) => handleAddressChange(e, 'shipping')} />
            </Form.Group>
            <Form.Group controlId="formStreet">
              <Form.Label>Street</Form.Label>
              <Form.Control type="text" name="street" value={shippingAddress.street} onChange={(e) => handleAddressChange(e, 'shipping')} />
            </Form.Group>
            <Form.Group controlId="formLocality">
              <Form.Label>Locality</Form.Label>
              <Form.Control type="text" name="locality" value={shippingAddress.locality} onChange={(e) => handleAddressChange(e, 'shipping')} />
            </Form.Group>
            <Form.Group controlId="formCity">
              <Form.Label>City</Form.Label>
              <Form.Control type="text" name="city" value={shippingAddress.city} onChange={(e) => handleAddressChange(e, 'shipping')} />
            </Form.Group>
            <Form.Group controlId="formPincode">
              <Form.Label>Pincode</Form.Label>
              <Form.Control type="text" name="pincode" value={shippingAddress.pincode} onChange={(e) => handleAddressChange(e, 'shipping')} />
            </Form.Group>
            <Form.Group controlId="formState">
              <Form.Label>State</Form.Label>
              <Form.Control type="text" name="state" value={shippingAddress.state} onChange={(e) => handleAddressChange(e, 'shipping')} />
            </Form.Group>
            <Form.Group controlId="formCountry">
              <Form.Label>Country</Form.Label>
              <Form.Control type="text" name="country" value={shippingAddress.country} onChange={(e) => handleAddressChange(e, 'shipping')} />
            </Form.Group>
            <Form.Group controlId="formTelephone">
              <Form.Label>Telephone</Form.Label>
              <Form.Control type="text" name="telephone" value={shippingAddress.telephone} onChange={(e) => handleAddressChange(e, 'shipping')} />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={shippingAddress.email} onChange={(e) => handleAddressChange(e, 'shipping')} />
            </Form.Group>
            <Button variant="primary" onClick={() => saveAddress(shippingAddress, 'shipping')}>Save Address</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Billing Modal */}
      <Modal show={showBillingModal} onHide={handleBillingModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Billing Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Add fields for billing address */}
            <Form.Group controlId="formHouseNo">
              <Form.Label>House No</Form.Label>
              <Form.Control type="text" name="houseNo" value={billingAddress.houseNo} onChange={(e) => handleAddressChange(e, 'billing', false)} />
            </Form.Group>
            <Form.Group controlId="formStreet">
              <Form.Label>Street</Form.Label>
              <Form.Control type="text" name="street" value={billingAddress.street} onChange={(e) => handleAddressChange(e, 'billing', false)} />
            </Form.Group>
            <Form.Group controlId="formLocality">
              <Form.Label>Locality</Form.Label>
              <Form.Control type="text" name="locality" value={billingAddress.locality} onChange={(e) => handleAddressChange(e, 'billing', false)} />
            </Form.Group>
            <Form.Group controlId="formCity">
              <Form.Label>City</Form.Label>
              <Form.Control type="text" name="city" value={billingAddress.city} onChange={(e) => handleAddressChange(e, 'billing', false)} />
            </Form.Group>
            <Form.Group controlId="formPincode">
              <Form.Label>Pincode</Form.Label>
              <Form.Control type="text" name="pincode" value={billingAddress.pincode} onChange={(e) => handleAddressChange(e, 'billing', false)} />
            </Form.Group>
            <Form.Group controlId="formState">
              <Form.Label>State</Form.Label>
              <Form.Control type="text" name="state" value={billingAddress.state} onChange={(e) => handleAddressChange(e, 'billing', false)} />
            </Form.Group>
            <Form.Group controlId="formCountry">
              <Form.Label>Country</Form.Label>
              <Form.Control type="text" name="country" value={billingAddress.country} onChange={(e) => handleAddressChange(e, 'billing', false)} />
            </Form.Group>
            <Form.Group controlId="formTelephone">
              <Form.Label>Telephone</Form.Label>
              <Form.Control type="text" name="telephone" value={billingAddress.telephone} onChange={(e) => handleAddressChange(e, 'billing', false)} />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={billingAddress.email} onChange={(e) => handleAddressChange(e, 'billing', false)} />
            </Form.Group>
            <Button variant="primary" onClick={() => saveAddress(billingAddress, 'billing')}>Save Address</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Checkout;
