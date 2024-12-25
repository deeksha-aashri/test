import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductCard = ({ book }) => {
  const { title, price, coverImages, description, _id } = book;
  const navigate = useNavigate();  // Hook for navigating

  // Truncate description to 20 words
  const truncateDescription = (desc) => {
    const words = desc.split(' ');
    return words.length > 20 ? words.slice(0, 20).join(' ') + '...' : desc;
  };

  const handleSingleBook = () => {
    navigate(`/book/${_id}`);  
  };

  return (
    <Card className="mb-4 product-card" style={{ width: '18rem', height: '90%' }}>
      {coverImages[0] ? (
        <Card.Img 
          variant="top" 
          src={coverImages[0]} 
          alt={title} 
          style={{ height: '100%', objectFit: 'cover' }} 
        />
      ) : (
        <Card.Img 
          variant="top" 
          src="https://via.placeholder.com/150" 
          alt={title} 
          style={{ height: '50%', objectFit: 'cover' }} 
        />
      )}
      <Card.Body style={{ marginBottom: '20px' }}>
        <Card.Title>{title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">${price}</Card.Subtitle>
        <Card.Text>{truncateDescription(description)}</Card.Text>
        <Button variant="primary" style={{ backgroundColor: '#007bff' }} onClick={handleSingleBook}>View Details</Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
