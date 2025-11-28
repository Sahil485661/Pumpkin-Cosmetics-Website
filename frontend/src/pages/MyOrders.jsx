import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getMyOrders, clearErrors } from '../features/order/orderSlice';
import { toast } from 'react-toastify';
import '../OrderStyles/MyOrders.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import Loader from '../components/Loader';

function MyOrders() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, orders } = useSelector((state) => state.order);
    const { isAuthenticated } = useSelector((state) => state.user);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            dispatch(getMyOrders());
        }
    }, [dispatch, isAuthenticated, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(clearErrors());
        }
    }, [error, dispatch]);

    return (
        <>
            <PageTitle title="My Orders" />
            <Navbar />
            {loading ? (
                <Loader />
            ) : (
                <div className="my-orders-container">
                    <h1>My Orders</h1>
                    {orders && orders.length > 0 ? (
                        <div className="table-responsive">
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Status</th>
                                        <th>Items Qty</th>
                                        <th>Amount</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id}>
                                            <td>{order._id}</td>
                                            <td style={{
                                                color: order.orderStatus === 'Delivered' ? 'green' : 'red'
                                            }}>
                                                {order.orderStatus}
                                            </td>
                                            <td>{order.orderItems.length}</td>
                                            <td>₹{order.totalPrice}</td>
                                            <td>
                                                <Link to={`/order/${order._id}`} className="order-link">
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="no-orders">
                            <p className="no-order-message">No orders found</p>
                        </div>
                    )}
                </div>
            )}
            <Footer />
        </>
    );
}

export default MyOrders;
