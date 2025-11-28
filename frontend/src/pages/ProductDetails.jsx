import React, { useEffect, useState } from 'react'
import '../pageStyles/ProductDetails.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Rating from '../components/Rating';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductDetails, removeErrors } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';
import { createReview } from '../features/products/reviewActions';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';


function ProductDetails() {
    const [userRating, setUserRating] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [comment, setComment] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);
    const [thumbnailsToShow, setThumbnailsToShow] = useState(4);
    
    const handleRatingChange = (newRating) => {
        setUserRating(newRating);
    }
    
    const { loading, error, product } = useSelector((state) => state.product);
    const { isAuthenticated } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    
    useEffect(() => {
        if (id) {
            dispatch(getProductDetails(id));
        }
        return () => {
            dispatch(removeErrors());
        }
    }, [dispatch, id]);
    
    useEffect(() => {
        if (error) {
            toast.error(error?.message || error, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000
            });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);
    
    // Update selected image when product changes
    useEffect(() => {
        if (product && product.image && product.image.length > 0) {
            setSelectedImage(0);
        }
    }, [product]);
    
    if (loading) {
        return (
            <>
                <Navbar />
                <Loader />
                <Footer />
            </>
        )
    }
    
    if (error || !product) {
        return (
            <>
                <Navbar />
                <h1>Product not found</h1>
                <Footer />
            </>
        )
    }
    
    const handleThumbnailClick = (index) => {
        setSelectedImage(index);
    };
    
    const handlePrevThumbnails = () => {
        if (selectedImage > 0) {
            setSelectedImage(selectedImage - 1);
        }
    };
    
    const handleNextThumbnails = () => {
        if (selectedImage < product.image.length - 1) {
            setSelectedImage(selectedImage + 1);
        }
    };
    
    return (
        <>
            <PageTitle title={`${product.name} - Details`} />
            <Navbar />
            <div className="product-details-container">
                <div className="product-detail-container">
                    <div className="product-image-container">
                        {/* Main Product Image */}
                        <img 
                            src={product.image[selectedImage]?.url} 
                            alt={product.name} 
                            className='product-detail-image' 
                        />
                        
                        {/* Thumbnails Navigation */}
                        {product.image.length > 1 && (
                            <div className="product-thumbnails">
                                <button 
                                    className="thumbnail-nav-btn prev-btn"
                                    onClick={handlePrevThumbnails}
                                    disabled={selectedImage === 0}
                                >
                                    &lt;
                                </button>
                                
                                <div className="thumbnails-container">
                                    {product.image.map((img, index) => (
                                        <img 
                                            key={index}
                                            src={img.url} 
                                            alt={`${product.name} ${index + 1}`} 
                                            className={`thumbnail-image ${index === selectedImage ? 'selected' : ''}`}
                                            onClick={() => handleThumbnailClick(index)}
                                        />
                                    ))}
                                </div>
                                
                                <button 
                                    className="thumbnail-nav-btn next-btn"
                                    onClick={handleNextThumbnails}
                                    disabled={selectedImage === product.image.length - 1}
                                >
                                    &gt;
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="product-info">
                        <h2>{product.name}</h2>
                        <h3 className="product-description">{product.description}</h3>
                        <br />
                        <h2 className="product-price">Price ₹{product.price}</h2>

                        <div className="product-rating">
                            <Rating value={product.rating} disable={true} />
                            <span className="productCardSpan">({product.numberOfReviews} {product.numberOfReviews === 1 ? "Review" : "Reviews"})</span>
                        </div>

                        <div className="stock-status">
                            <span className={product.stock > 0 ? "in-stock" : "out-of-stock"}>
                                {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock" }
                            </span>
                        </div>

                        {product.stock > 0 && (
                            <>
                                <div className="quantity-controls">
                                    <span className="quantity-level">Quantity:</span>
                                    <button className="quantity-button" onClick={() => quantity > 1 && setQuantity(quantity - 1)}>-</button>
                                    <input type="text" className="quantity-value" value={quantity} readOnly />
                                    <button className="quantity-button" onClick={() => quantity < product.stock && setQuantity(quantity + 1)}>+</button>
                                </div>
                                <button className="add-to-cart-btn" onClick={() => {
                                    dispatch(addToCart({
                                        product: product._id,
                                        name: product.name,
                                        price: product.price,
                                        image: product.image[selectedImage].url,
                                        stock: product.stock,
                                        quantity
                                    }));
                                    toast.success('Item added to cart', { position: 'top-center', autoClose: 2000 });
                                }}>Add to Cart</button>
                            </>
                        )}

                        <form className="review-form" onSubmit={(e) => {
                            e.preventDefault();
                            if (!isAuthenticated) {
                                toast.error('Please login to submit a review', { position: 'top-center', autoClose: 3000 });
                                navigate('/login');
                                return;
                            }
                            if (userRating === 0) {
                                toast.error('Please select a rating', { position: 'top-center', autoClose: 3000 });
                                return;
                            }
                            if (!comment.trim()) {
                                toast.error('Please write a comment', { position: 'top-center', autoClose: 3000 });
                                return;
                            }
                            dispatch(createReview({ rating: userRating, comment, productId: id }));
                            toast.success('Review submitted successfully', { position: 'top-center', autoClose: 3000 });
                            setComment('');
                            setUserRating(0);
                            dispatch(getProductDetails(id));
                        }}>
                            <h3>Write a Review</h3>
                            <Rating value={userRating} disable={false} onRatingChange={handleRatingChange} />

                            <textarea placeholder='Write Your Review' className="review-input" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                            <button type="submit" className="submit-review-btn">Submit Review</button>
                        </form>
                    </div>
                </div>
                <div className="reviews-container">
                    <h3>Customer Reviews</h3>
                   {product.reviews && product.reviews.length > 0 ? (
                       <div className="reviews-section">
                            {product.reviews.map((review, index) =>(
                                <div className="review-item" key={index}>
                                    <div className="review-header">
                                        <Rating value={Number(review.rating)} disable={true} />
                                    </div>
                                    <p className="review-comment">{review.comment}</p>
                                    <p className="review-name">By {review.name}</p>
                                </div>
                            ))}
                        </div>
                   ) : (
                       <p className="no-reviews">No Reviews yet. Be the first to review this product</p>
                   )}
                </div>
            </div>

            <Footer />
        </>
    )
}

export default ProductDetails