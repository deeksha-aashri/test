import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios'; // For making API calls
import { useNavigate } from 'react-router-dom'; // For navigation
import 'bootstrap/dist/css/bootstrap.min.css';
import swal from 'sweetalert2'
const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contactNumber: ''  
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:5000/api/signup', formData);
      
      if (response && response.data) {
        console.log('Response:', response.data);
        localStorage.setItem('userToken', response.data.token); // Save the token
        setSuccess('Sign up successful!');
        new swal('Sign up successful!')
        setTimeout(() => {
          navigate('/'); // Redirect to '/'
        }, 2000); // Redirect after a short delay to show the success message
      } else {
        console.error('Unexpected response structure:', response);
        setError('Something went wrong, please try again.');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Error Response:', error.response.data);
        setError(`Error: ${error.response.data.message || 'Sign up failed'}`);
      } else {
        console.error('Error:', error.message);
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };
  
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="my-4">Sign Up</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </Form.Group>

            <Form.Group controlId="formContactNumber" className="mb-3">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Enter contact number"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Sign Up
            </Button>
          </Form>
          <p className="mt-3">
            Already have an account? <a href="/signin">Sign In</a>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;
