import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllOrders, updateOrder, deleteOrder, clearSuccess, clearErrors } from '../features/admin/adminSlice';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import Loader from '../components/Loader';
import '../AdminStyles/OrdersList.css';

function AdminOrders() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user: currentUser, isAuthenticated } = useSelector((state) => state.user);
    const { orders, loading, error, success, message, totalAmount } = useSelector((state) => state.admin);
    const [selectedStatus, setSelectedStatus] = useState({});
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const orderStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

    useEffect(() => {
        if (!isAuthenticated || currentUser?.role !== 'admin') {
            navigate('/profile');
            return;
        }
        dispatch(getAllOrders());
    }, [isAuthenticated, currentUser, navigate, dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
    }, [error, dispatch]);

    useEffect(() => {
        if (success && message) {
            toast.success(message);
            dispatch(clearSuccess());
            dispatch(getAllOrders());
        }
    }, [success, message, dispatch]);

    const handleStatusChange = (orderId, currentStatus) => {
        setSelectedStatus(prev => ({ ...prev, [orderId]: currentStatus }));
    };

    const handleUpdateStatus = (orderId) => {
        const newStatus = selectedStatus[orderId];
        if (newStatus) {
            dispatch(updateOrder({ id: orderId, status: newStatus }));
        }
    };

    const handleDeleteOrder = (orderId) => {
        if (deleteConfirm === orderId) {
            dispatch(deleteOrder(orderId));
            setDeleteConfirm(null);
        } else {
            setDeleteConfirm(orderId);
        }
    };

    if (!isAuthenticated || currentUser?.role !== 'admin') {
        return null;
    }

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <PageTitle title="Manage Orders" />
            <Navbar />
            <div className="admin-orders-container">
                <div className="admin-header">
                    <h1>Manage Orders</h1>
                    <div className="order-stats">
                        <p>Total Orders: {orders.length}</p>
                        <p>Total Revenue: ₹{totalAmount?.toLocaleString() || 0}</p>
                    </div>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="orders-table-wrapper">
                    {orders.length > 0 ? (
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Total Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td>#{order._id.substring(0, 6)}</td>
                                        <td>
                                            <div className="customer-info">
                                                <p className="name">{order.user?.name || 'Unknown'}</p>
                                                <p className="email">{order.user?.email || ''}</p>
                                            </div>
                                        </td>
                                        <td>{order.orderItems?.length || 0} items</td>
                                        <td className="amount">₹{order.totalPrice?.toLocaleString() || 0}</td>
                                        <td>
                                            <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <select
                                                    value={selectedStatus[order._id] || order.orderStatus}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    className="status-select"
                                                >
                                                    {orderStatuses.map(status => (
                                                        <option key={status} value={status}>
                                                            {status}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => handleUpdateStatus(order._id)}
                                                    className="btn-update"
                                                    disabled={!selectedStatus[order._id] || selectedStatus[order._id] === order.orderStatus}
                                                >
                                                    Update
                                                </button>
                                                {order.orderStatus === 'Delivered' && (
                                                    <button
                                                        onClick={() => handleDeleteOrder(order._id)}
                                                        className={`btn-delete ${deleteConfirm === order._id ? 'confirm' : ''}`}
                                                    >
                                                        {deleteConfirm === order._id ? 'Confirm Delete' : 'Delete'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="no-orders">
                            <p>No orders found</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default AdminOrders;
