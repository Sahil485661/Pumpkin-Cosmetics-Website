import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder, clearSuccess } from '../features/order/orderSlice';
import { clearCart } from '../features/cart/cartSlice';
import { CreditCard, AccountBalance, MoneyOff, LocalShipping, CheckCircle, Lock } from '@mui/icons-material';
import { toast } from 'react-toastify';
import '../CartStyles/Payment.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import Loader from '../components/Loader';

function Payment() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [loading, setLoading] = useState(false);
    
    const { cartItems, shippingInfo } = useSelector((state) => state.cart);
    const { success, loading: orderLoading } = useSelector((state) => state.order);
    
    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));

    useEffect(() => {
        if (success) {
            dispatch(clearSuccess());
            dispatch(clearCart());
            navigate('/success');
        }
    }, [success, dispatch, navigate]);

    const handlePayment = async () => {
        if (!shippingInfo || Object.keys(shippingInfo).length === 0) {
            toast.error('Please enter shipping address');
            navigate('/shipping');
            return;
        }

        setLoading(true);
        
        const order = {
            shippingInfo,
            orderItems: cartItems,
            itemsPrice: orderInfo.subtotal,
            taxPrice: orderInfo.tax,
            shippingPrice: orderInfo.shippingCharges,
            totalPrice: orderInfo.totalPrice,
            paymentInfo: {
                id: `payment_${Date.now()}`,
                status: paymentMethod === 'cod' ? 'Pending' : 'Succeeded'
            }
        };
        
        try {
            dispatch(createOrder(order));
        } catch (error) {
            toast.error('Payment failed. Please try again.');
            setLoading(false);
        }
    };

    if (orderLoading || loading) {
        return <Loader />;
    }

    return (
        <>
            <PageTitle title="Payment" />
            <Navbar />
            <div className="payment-page">
                <div className="payment-container">
                    {/* Left Section - Order Summary */}
                    <div className="payment-summary-section">
                        <div className="order-summary-card">
                            <h3 className="summary-title">Order Summary</h3>
                            
                            <div className="summary-items">
                                <p className="summary-row">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span className="price">₹{orderInfo?.subtotal?.toFixed(2)}</span>
                                </p>
                                <p className="summary-row">
                                    <span>Shipping Charges</span>
                                    <span className="price">₹{orderInfo?.shippingCharges?.toFixed(2)}</span>
                                </p>
                                <p className="summary-row">
                                    <span>Tax & Fees</span>
                                    <span className="price">₹{orderInfo?.tax?.toFixed(2)}</span>
                                </p>
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-total">
                                <p className="total-row">
                                    <span>Total Amount</span>
                                    <span className="total-price">₹{orderInfo?.totalPrice?.toFixed(2)}</span>
                                </p>
                            </div>

                            {/* Shipping Info */}
                            <div className="shipping-info-card">
                                <LocalShipping className="shipping-icon" />
                                <div>
                                    <p className="shipping-label">Delivery To</p>
                                    <p className="shipping-address">
                                        {shippingInfo?.address}, {shippingInfo?.city}, {shippingInfo?.state} - {shippingInfo?.pinCode}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Payment Methods */}
                    <div className="payment-section">
                        <div className="payment-card">
                            <div className="payment-header">
                                <h2 className="payment-title">Choose Payment Method</h2>
                                <div className="security-badge">
                                    <Lock className="lock-icon" />
                                    <span>100% Secure</span>
                                </div>
                            </div>

                            <div className="payment-methods">
                                {/* Cash on Delivery */}
                                <label className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="radio-input"
                                    />
                                    <div className="option-content">
                                        <MoneyOff className="option-icon" />
                                        <div className="option-text">
                                            <span className="option-title">Cash on Delivery</span>
                                            <span className="option-desc">Pay when you receive</span>
                                        </div>
                                    </div>
                                    {paymentMethod === 'cod' && <CheckCircle className="check-icon" />}
                                </label>

                                {/* Credit/Debit Card */}
                                <label className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="card"
                                        checked={paymentMethod === 'card'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="radio-input"
                                    />
                                    <div className="option-content">
                                        <CreditCard className="option-icon" />
                                        <div className="option-text">
                                            <span className="option-title">Credit/Debit Card</span>
                                            <span className="option-desc">Visa, Mastercard, RuPay</span>
                                        </div>
                                    </div>
                                    {paymentMethod === 'card' && <CheckCircle className="check-icon" />}
                                </label>

                                {/* UPI / Net Banking */}
                                <label className={`payment-option ${paymentMethod === 'upi' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="upi"
                                        checked={paymentMethod === 'upi'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="radio-input"
                                    />
                                    <div className="option-content">
                                        <AccountBalance className="option-icon" />
                                        <div className="option-text">
                                            <span className="option-title">UPI / Net Banking</span>
                                            <span className="option-desc">Fast & easy online payment</span>
                                        </div>
                                    </div>
                                    {paymentMethod === 'upi' && <CheckCircle className="check-icon" />}
                                </label>
                            </div>

                            {/* Benefits */}
                            <div className="payment-benefits">
                                <div className="benefit-item">
                                    <span className="benefit-icon">✓</span>
                                    <span>Free returns within 7 days</span>
                                </div>
                                <div className="benefit-item">
                                    <span className="benefit-icon">✓</span>
                                    <span>Easy returns & refunds</span>
                                </div>
                                <div className="benefit-item">
                                    <span className="benefit-icon">✓</span>
                                    <span>Secure transactions</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="payment-actions">
                                <button 
                                    className="pay-btn primary"
                                    onClick={handlePayment}
                                    disabled={loading || orderLoading}
                                >
                                    {loading || orderLoading ? (
                                        <>
                                            <span className="spinner"></span>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            {paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}
                                        </>
                                    )}
                                </button>
                                <button 
                                    className="pay-btn secondary"
                                    onClick={() => navigate('/order/confirm')}
                                >
                                    Back to Review
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Payment;
