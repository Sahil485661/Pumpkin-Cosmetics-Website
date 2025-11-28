import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle } from '@mui/icons-material';
import '../CartStyles/PaymentSuccess.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';

function PaymentSuccess() {
    const location = useLocation();
    const orderData = location.state?.orderData;

    return (
        <>
            <PageTitle title="Order Success" />
            <Navbar />
            <div className="payment-success-container">
                <div className="success-content">
                    <div className="success-icon-container">
                        <CheckCircle className="success-icon" fontSize="large" />
                    </div>
                    <h1 className="success-title">Order Placed Successfully!</h1>
                    <p className="success-message">
                        Thank you for your purchase. Your order has been placed successfully.
                        {orderData?.orderId && (
                            <span className="order-id">Order ID: {orderData.orderId}</span>
                        )}
                    </p>
                    
                    <div className="success-details">
                        <div className="success-card">
                            <h3>What's Next?</h3>
                            <ul>
                                <li>We've sent a confirmation email to your registered email address</li>
                                <li>Your order will be processed within 24 hours</li>
                                <li>You'll receive updates on your order status</li>
                            </ul>
                        </div>
                        
                        <div className="success-card">
                            <h3>Order Summary</h3>
                            <ul>
                                <li>Order Confirmation: Completed</li>
                                <li>Payment Status: Paid</li>
                                <li>Expected Delivery: 3-5 Business Days</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="success-actions">
                        <Link to="/orders" className="btn btn-primary">View My Orders</Link>
                        <Link to="/" className="btn btn-secondary">Continue Shopping</Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default PaymentSuccess;