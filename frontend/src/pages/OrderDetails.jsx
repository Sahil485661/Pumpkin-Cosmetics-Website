import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderDetails, clearErrors } from '../features/order/orderSlice';
import { toast } from 'react-toastify';
import '../OrderStyles/OrderDetails.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import Loader from '../components/Loader';

function OrderDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, order } = useSelector((state) => state.order);
    const { isAuthenticated } = useSelector((state) => state.user);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else if (id) {
            dispatch(getOrderDetails(id));
        }
    }, [dispatch, id, isAuthenticated, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(clearErrors());
        }
    }, [error, dispatch]);

    return (
        <>
            <PageTitle title="Order Details" />
            <Navbar />
            {loading ? (
                <Loader />
            ) : order ? (
                <div className="order-details-container">
                    <h1>Order #{order._id}</h1>
                    <div className="order-info-section">
                        <div className="shipping-info">
                            <h2>Shipping Information</h2>
                            <p><strong>Name:</strong> {order.user?.name}</p>
                            <p><strong>Phone:</strong> {order.shippingInfo?.phoneNo}</p>
                            <p><strong>Address:</strong> {order.shippingInfo?.address}, {order.shippingInfo?.city}, {order.shippingInfo?.state}, {order.shippingInfo?.country} - {order.shippingInfo?.pinCode}</p>
                        </div>
                        <div className="payment-info">
                            <h2>Payment</h2>
                            <p><strong>Status:</strong> <span style={{ color: order.paymentInfo?.status === 'Succeeded' ? 'green' : 'red' }}>
                                {order.paymentInfo?.status}
                            </span></p>
                            <p><strong>Amount:</strong> ₹{order.totalPrice}</p>
                        </div>
                        <div className="order-status-info">
                            <h2>Order Status</h2>
                            <p style={{
                                color: order.orderStatus === 'Delivered' ? 'green' : 'red',
                                fontWeight: 'bold',
                                fontSize: '18px'
                            }}>
                                {order.orderStatus}
                            </p>
                        </div>
                    </div>
                    <div className="order-items-section">
                        <h2>Order Items</h2>
                        {order.orderItems && order.orderItems.map((item) => (
                            <div key={item._id} className="order-item">
                                <img src={item.image} alt={item.name} />
                                <div className="item-info">
                                    <p>{item.name}</p>
                                    <span>{item.quantity} x ₹{item.price} = <strong>₹{item.price * item.quantity}</strong></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="no-order">Order not found</div>
            )}
            <Footer />
        </>
    );
}

export default OrderDetails;
