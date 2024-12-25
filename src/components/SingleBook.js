import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const SingleBook = () => {
  const { bookId } = useParams();  // Get the book ID from the route params
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]); 
  const [quantity, setQuantity] = useState(1); 
  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const navigate = useNavigate();  

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/book/${bookId}`);
        setBook(response.data);
        setReviews(response.data.reviews || []);
      } catch (error) {
        setError('Error retrieving book data');
        console.error(error);
      }
    };

    fetchBook();
  }, [bookId]);

  if (error) {
    return <div>{error}</div>;
  }

  const handleAddToCart = async () => {
    try {
      const userId = localStorage.getItem('userId');  // Get the logged-in user's ID, if available
      const cartData = {
        user_id: userId || null,  // Pass null if user is a guest
        book_id: book._id,  // Automatically use the fetched book's _id
        quantity: quantity,  // Use the quantity from the input field
        price: book.price,  // Use the book's price
      };
  
      console.log("Cartdata", cartData);
      const response = await axios.post('http://localhost:5000/api/add', cartData);
      Swal.fire('Added to cart');
      window.location.reload(); 
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Failed to add to cart');
    }
  };

  const handleBuyNow = () => {
    navigate(`/checkout`);
  };

  const handleAddReview = async () => {
    const token = localStorage.getItem('userToken'); // Get the token from local storage
  
    // Check if the user is logged in
    if (!token) {
      Swal.fire('Error', 'You must be logged in to submit a review.', 'error');
      return;
    }
  
    const reviewPayload = {
      bookId,
      rating: reviewData.rating,
      comment: reviewData.comment,
    };
  
    try {
      const response = await axios.post('http://localhost:5000/api/addReview', reviewPayload, {
        headers: {
          Authorization: `Bearer ${token}`, // Use the token stored in local storage
        },
      });
  
      Swal.fire('Success', 'Review submitted successfully!', 'success');
      setReviews([...reviews, response.data.review]); // Update the local reviews state
      setIsReviewFormVisible(false); // Hide the form after submission
      setReviewData({ rating: 5, comment: '' }); // Reset form fields
    } catch (error) {
      console.error('Error adding review:', error);
      // Check for specific error messages from the server
      const errorMessage = error.response?.data?.message || 'Failed to submit review.';
      Swal.fire('Error', errorMessage, 'error');
    }
  };
  

  return (
    <div className="single-book-container">
      {book ? (
        <div className="book-details-wrapper">
          {/* Left Side: Book Image */}
          <div className="book-image-section">
            <img
              src={book.coverImages[0] || 'https://via.placeholder.com/150'}
              alt={book.title}
              className="book-image"
            />
          </div>

          {/* Right Side: Book Details */}
          <div className="book-details-section">
            <h1>{book.title}</h1>
            <p>{book.description}</p>
            <p><strong>Price:</strong> ${book.price}</p>

            {/* Quantity Input (Optional) */}
            <div className="quantity-section">
              <label>Quantity: </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                max={book.stock || 10}  // Example: stock can be dynamic
              />
            </div>

            {/* Add to Cart and Buy Now buttons */}
            <div className="button-group">
              <Button variant="success" onClick={handleAddToCart}>Add to Cart</Button>
              <Button variant="primary" onClick={handleBuyNow}>Buy Now</Button>
            </div>

            {/* Add Review Button - Only if user is logged in */}
            {localStorage.getItem('userToken') && (  // Check for 'token' in local storage
              <Button variant="info" onClick={() => setIsReviewFormVisible(!isReviewFormVisible)}>
                {isReviewFormVisible ? 'Cancel Review' : 'Add Review'}
              </Button>
            )}

            {/* Review Form */}
            {isReviewFormVisible && (
              <div className="review-form">
                <h3>Write a Review</h3>
                <div>
                  <label>Rating:</label>
                  <select
                    value={reviewData.rating}
                    onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <option key={star} value={star}>{star}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Comment:</label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                    rows="4"
                  />
                </div>
                <Button variant="success" onClick={handleAddReview}>Submit Review</Button>
              </div>
            )}

            {/* Reviews Section */}
            <div className="reviews-section">
              <h3>Reviews</h3>
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={index} className="review">
                    <h5>{review.userId.name || 'Anonymous'}</h5>
                    <p>{review.comment}</p>
                    <p>Rating: {review.rating} / 5</p>
                  </div>
                ))
              ) : (
                <p>No reviews yet. Be the first to review this book!</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default SingleBook;
