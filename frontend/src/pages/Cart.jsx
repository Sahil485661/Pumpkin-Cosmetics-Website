import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart, removeFromCart } from '../features/cart/cartSlice';
import { Delete } from '@mui/icons-material';
import '../CartStyles/Cart.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';

function Cart() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.cart);
    const { isAuthenticated } = useSelector((state) => state.user);

    const increaseQuantity = (item) => {
        const newQty = item.quantity + 1;
        if (newQty > item.stock) return;
        dispatch(addToCart({ ...item, quantity: newQty }));
    };

    const decreaseQuantity = (item) => {
        const newQty = item.quantity - 1;
        if (newQty < 1) return;
        dispatch(addToCart({ ...item, quantity: newQty }));
    };

    const removeCartItem = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        if (isAuthenticated) {
            navigate('/shipping');
        } else {
            navigate('/login');
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

    return (
        <>
            <PageTitle title="Shopping Cart" />
            <Navbar />
            {cartItems.length === 0 ? (
                <div className="empty-cart-container">
                    <p className="empty-cart-message">Your cart is empty</p>
                    <Link to="/products" className="viewProducts">View Products</Link>
                </div>
            ) : (
                <div className="cart-page">
                    <div className="cart-items">
                        <h2 className="cart-items-heading">Shopping Cart</h2>
                        <div className="cart-table">
                            <div className="cart-table-header">
                                <div>Product</div>
                                <div>Price</div>
                                <div>Quantity</div>
                                <div>Total</div>
                            </div>
                            {cartItems.map((item) => (
                                <div className="cart-item" key={item.product}>
                                    <div className="item-info">
                                        <img src={item.image} alt={item.name} className="item-image" />
                                        <div className="item-details">
                                            <h3 className="item-name">{item.name}</h3>
                                            <p className="item-price">₹{item.price}</p>
                                        </div>
                                    </div>
                                    <div>₹{item.price}</div>
                                    <div className="quantity-controls">
                                        <button className="quantity-button" onClick={() => decreaseQuantity(item)}>-</button>
                                        <input type="number" className="quantity-input" value={item.quantity} readOnly />
                                        <button className="quantity-button" onClick={() => increaseQuantity(item)}>+</button>
                                    </div>
                                    <div className="item-actions">
                                        <div className="item-total">₹{item.price * item.quantity}</div>
                                        <button className="remove-item-btn" onClick={() => removeCartItem(item.product)}>
                                            <Delete fontSize="small" /> Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="price-summary">
                        <h3 className="price-summary-heading">Order Summary</h3>
                        <div className="summary-item">
                            <span>Subtotal:</span>
                            <span>₹{subtotal}</span>
                        </div>
                        <div className="summary-item">
                            <span>Shipping:</span>
                            <span>Calculated at checkout</span>
                        </div>
                        <div className="summary-total">
                            <span>Total:</span>
                            <span>₹{subtotal}</span>
                        </div>
                        <button className="checkout-button" onClick={checkoutHandler}>
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}

export default Cart;
