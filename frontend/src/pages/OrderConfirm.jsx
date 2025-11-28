import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../CartStyles/OrderConfirm.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';

function OrderConfirm() {
    const navigate = useNavigate();
    const { cartItems, shippingInfo } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);

    const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const shippingCharges = subtotal > 500 ? 0 : 70;
    const tax = subtotal * 0.05;
    const totalPrice = subtotal + tax + shippingCharges;

    const proceedToPayment = () => {
        const data = {
            subtotal,
            shippingCharges,
            tax,
            totalPrice
        };
        sessionStorage.setItem('orderInfo', JSON.stringify(data));
        navigate('/process/payment');
    };

    return (
        <>
            <PageTitle title="Confirm Order" />
            <Navbar />
            <div className="order-confirm-container">
                <div className="order-sections">
                    <div className="shipping-info-section">
                        <h2>Shipping Info</h2>
                        <div className="info-detail">
                            <p><strong>Name:</strong> {user?.name}</p>
                            <p><strong>Phone:</strong> {shippingInfo.phoneNo}</p>
                            <p><strong>Address:</strong> {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state}, {shippingInfo.country} - {shippingInfo.pinCode}</p>
                        </div>
                    </div>
                    <div className="cart-items-section">
                        <h2>Your Cart Items</h2>
                        {cartItems.map((item) => (
                            <div key={item.product} className="confirm-cart-item">
                                <img src={item.image} alt={item.name} />
                                <div>
                                    <p>{item.name}</p>
                                    <span>{item.quantity} x ₹{item.price} = <strong>₹{item.price * item.quantity}</strong></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="order-summary-section">
                    <h2>Order Summary</h2>
                    <div className="summary-detail">
                        <div>
                            <span>Subtotal:</span>
                            <span>₹{subtotal}</span>
                        </div>
                        <div>
                            <span>Shipping Charges:</span>
                            <span>₹{shippingCharges}</span>
                        </div>
                        <div>
                            <span>GST (5%):</span>
                            <span>₹{tax.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="total-price">
                        <span>Total:</span>
                        <span>₹{totalPrice.toFixed(2)}</span>
                    </div>
                    <button className="proceed-payment-btn" onClick={proceedToPayment}>
                        Proceed to Payment
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default OrderConfirm;
