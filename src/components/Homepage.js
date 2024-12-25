import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [onSaleBooks, setOnSaleBooks] = useState([]);
  const [bestSellingBooks, setBestSellingBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const [booksResponse, onSaleResponse, bestSellingResponse] = await Promise.all([
          axios.post('http://localhost:5000/api/books'),
          axios.get('http://localhost:5000/api/books-on-sale'),
          axios.get('http://localhost:5000/api/best-sellers') // API for best selling books
        ]);

        if (booksResponse.status === 200 && onSaleResponse.status === 200 && bestSellingResponse.status === 200) {
          setBooks(booksResponse.data.data);
          setOnSaleBooks(onSaleResponse.data.data);
          setBestSellingBooks(bestSellingResponse.data.data);
          setLoading(false);
        } else {
          setError('Failed to fetch books');
          setLoading(false);
        }
      } catch (error) {
        console.error('An error occurred:', error);
        setError('An unexpected error occurred.');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <Container>
      {/* Books on Sale Section */}
      {onSaleBooks.length > 0 && (
        <Row className="section books-on-sale my-4">
          <h2>Books on Sale</h2>
          <Row className="mb-4">
            {onSaleBooks.slice(0, 8).map((book) => (
              <Col key={book._id} md={3}>
                <div className="sale-book-card book-card">
                  {/* Image taking up 50% of card height */}
                  <div className="book-image-container">
                    {book.coverImages && book.coverImages[0] && (
                      <img src={book.coverImages[0]} alt={book.title} className="book-image" />
                    )}
                  </div>
                  <div className="book-details">
                    <h5>{book.title}</h5>
                    <p>Price: ${book.price}</p>
                    <Button as={Link} to={`/book/${book._id}`} variant="primary">
                      View Details
                    </Button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
          <Button as={Link} to="/books-on-sale" variant="success" className="mb-4">
            View All Books on Sale
          </Button>
        </Row>
      )}

      {/* Best Selling Section */}
      {bestSellingBooks.length > 0 && (
        <Row className="section best-sellers my-4">
          <h2>Best Selling Books</h2>
          <Row className="mb-4">
            {bestSellingBooks.slice(0, 8).map((book) => (
              <Col key={book._id} md={3}>
                <div className="best-seller-book-card book-card">
                  {/* Image taking up 50% of card height */}
                  <div className="book-image-container">
                    {book.coverImages && book.coverImages[0] && (
                      <img src={book.coverImages[0]} alt={book.title} className="book-image" />
                    )}
                  </div>
                  <div className="book-details">
                    <h5>{book.title}</h5>
                    <p>Price: ${book.price}</p>
                    <Button as={Link} to={`/book/${book._id}`} variant="primary">
                      View Details
                    </Button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
          <Button as={Link} to="/best-sellers" variant="success" className="mb-4">
            View All Best Selling Books
          </Button>
        </Row>
      )}

      {/* Regular Books Section */}
      <Row className="section all-books my-4">
        <h2>All Books</h2>
        <Row>
          {books.map((book) => (
            <Col key={book._id} md={4}>
              <ProductCard book={book} />
            </Col>
          ))}
        </Row>
      </Row>
    </Container>
  );
};

export default HomePage;
