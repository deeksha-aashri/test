import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../ProductCard';
import { Container, Row, Col, Alert } from 'react-bootstrap';

const CategoryPage = () => {
  const { category } = useParams();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooksByCategory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/category/${category}`);
        setBooks(response.data.data);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    fetchBooksByCategory();
  }, [category]);

  return (
    <Container>
      {books.length === 0 ? (
        <Row className="my-4 justify-content-center">
          <Col md={8}>
            <Alert variant="info" className="text-center">
              <h4>Oops! Looks like your choice isn't on our shelves yet.</h4>
              <p>But don't worry, we have plenty of other intriguing reads that might tickle your fancy. Why not take a peek at our other collections?</p>
            </Alert>
          </Col>
        </Row>
      ) : (
        <Row className="my-4">
          {books.map((book) => (
            <Col key={book._id} md={4}>
              <ProductCard book={book} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default CategoryPage;
