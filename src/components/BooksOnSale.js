import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard'; // Ensure you have this component
import axios from 'axios'; // For making API calls

const BooksOnSale = () => {
  const [booksOnSale, setBooksOnSale] = useState([]);

  useEffect(() => {
    const fetchBooksOnSale = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/books-on-sale'); // Adjust the endpoint as needed
        if (response.data && response.data.data) {
          setBooksOnSale(response.data.data);
        } else {
          console.error('Unexpected response structure:', response);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    fetchBooksOnSale();
  }, []);

  return (
    <Container style={{backgroundColor:"#ff000012"}}>
      <h2 className="my-4">Books on Sale</h2>
      <Row>
        {booksOnSale.map((book) => (
          <Col key={book._id} md={4}>
            <ProductCard book={book} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default BooksOnSale;
