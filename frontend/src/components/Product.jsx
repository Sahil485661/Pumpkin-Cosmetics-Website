import React, { useState } from 'react'
import '../componentStyles/Product.css'
import { Link } from 'react-router-dom'
import Rating from './Rating';

function Product({ product }) {   
  const [rating, setRating] = useState(0);
  const handleRatingChange = (newRating) => {
    setRating(rating);
    console.log(`Rating Changed to ${newRating}`);
  }

  return (
    <Link to={`/product/${product._id}`} key={product._id} className="product_id">
      <div className="product-card">
        <img src={product.image?.[0]?.url} alt={product.name} className='product-image-card'/>   
        <div className="product-details">
          <h3 className="product-title">{product.name}</h3>
          <p className="home-price"><strong>Price ₹</strong>{product.price}/-</p>
          <div className="rating_container">
            <Rating value={product.rating} onRatingChange={handleRatingChange} disable={true}/>
          </div>
          <span className="productCardSpan">
            ({product.numberOfReviews} {product.numberOfReviews===1 ? "Review" : "Reviews"})
          </span>
          <button className="add-to-cart">View Details</button>
        </div>
      </div>
    </Link>
  )
}

export default Product
