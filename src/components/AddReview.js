import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const ReviewForm = () => {
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleReviewChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('userToken');
    if (!token) {
      setError('You must be logged in to write a review.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Include token in the request
        },
        body: JSON.stringify({ review: reviewText }),
      });

      if (response.ok) {
        setSuccess('Review submitted successfully!');
        setReviewText('');
      } else {
        const result = await response.json();
        setError(result.message || 'Failed to submit review.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form.Group controlId="formReview">
        <Form.Label>Write a Review</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={reviewText}
          onChange={handleReviewChange}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit Review
      </Button>
    </Form>
  );
};

export default ReviewForm;
