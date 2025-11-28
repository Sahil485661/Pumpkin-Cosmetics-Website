import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../AdminStyles/Dashboard.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import Loader from '../components/Loader';

function AdminDashboard() {
    const navigate = useNavigate();
    const { user, loading: userLoading, isAuthenticated } = useSelector((state) => state.user);
    
    const [dashboardData, setDashboardData] = useState({
        products: {
            total: 0,
            outOfStock: 0
        },
        orders: {
            total: 0,
            revenue: 0,
            status: {
                processing: 0,
                shipped: 0,
                delivered: 0,
                cancelled: 0
            }
        },
        users: {
            total: 0
        }
    });
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [topProducts, setTopProducts] = useState([]);

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'admin') {
            navigate('/profile');
        } else {
            fetchDashboardData();
        }
    }, [isAuthenticated, user, navigate]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            // Fetch optimized dashboard data
            const response = await axios.get('/api/v1/admin/dashboard/stats', { 
                withCredentials: true 
            });
            
            const data = response.data.data;
            
            setDashboardData({
                products: {
                    total: data.products.total,
                    outOfStock: data.products.outOfStock
                },
                orders: {
                    total: data.orders.total,
                    revenue: data.orders.revenue,
                    status: data.orders.status
                },
                users: {
                    total: data.users.total
                }
            });
            
            setRecentOrders(data.recentOrders);
            setTopProducts(data.topProducts);
            
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch dashboard data');
            toast.error(error.response?.data?.message || 'Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (userLoading || loading) {
        return <Loader />;
    }

    if (!isAuthenticated || user?.role !== 'admin') {
        return null;
    }

    return (
        <>
            <PageTitle title="Admin Dashboard" />
            {/* <Navbar /> */}
            <div className="admin-dashboard">
                <div className="admin-header">
                    <h1>Admin Dashboard</h1>
                    <p>Welcome back, {user.name}</p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="admin-content">
                    {/* Stats Cards */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon products">
                                <span>🛍️</span>
                            </div>
                            <div className="stat-info">
                                <h3>{dashboardData.products.total}</h3>
                                <p>Products</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon orders">
                                <span>📦</span>
                            </div>
                            <div className="stat-info">
                                <h3>{dashboardData.orders.total}</h3>
                                <p>Orders</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon users">
                                <span>👥</span>
                            </div>
                            <div className="stat-info">
                                <h3>{dashboardData.users.total}</h3>
                                <p>Users</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon revenue">
                                <span>💰</span>
                            </div>
                            <div className="stat-info">
                                <h3>₹{dashboardData.orders.revenue.toLocaleString()}</h3>
                                <p>Revenue</p>
                            </div>
                        </div>
                        
                        <div className="stat-card">
                            <div className="stat-icon out-of-stock">
                                <span>⚠️</span>
                            </div>
                            <div className="stat-info">
                                <h3>{dashboardData.products.outOfStock}</h3>
                                <p>Out of Stock</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Charts and Analytics Section */}
                    <div className="analytics-section">
                        <div className="chart-container">
                            <h2>Order Status Distribution</h2>
                            <div className="order-status-chart">
                                <div className="chart-bar">
                                    <div className="bar processing" style={{height: `${(dashboardData.orders.status.processing / Math.max(1, dashboardData.orders.total)) * 100}%`}}></div>
                                    <span>Processing</span>
                                    <span className="count">{dashboardData.orders.status.processing}</span>
                                </div>
                                <div className="chart-bar">
                                    <div className="bar shipped" style={{height: `${(dashboardData.orders.status.shipped / Math.max(1, dashboardData.orders.total)) * 100}%`}}></div>
                                    <span>Shipped</span>
                                    <span className="count">{dashboardData.orders.status.shipped}</span>
                                </div>
                                <div className="chart-bar">
                                    <div className="bar delivered" style={{height: `${(dashboardData.orders.status.delivered / Math.max(1, dashboardData.orders.total)) * 100}%`}}></div>
                                    <span>Delivered</span>
                                    <span className="count">{dashboardData.orders.status.delivered}</span>
                                </div>
                                <div className="chart-bar">
                                    <div className="bar cancelled" style={{height: `${(dashboardData.orders.status.cancelled / Math.max(1, dashboardData.orders.total)) * 100}%`}}></div>
                                    <span>Cancelled</span>
                                    <span className="count">{dashboardData.orders.status.cancelled}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="recent-orders">
                            <h2>Recent Orders</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map(order => (
                                        <tr key={order._id}>
                                            <td>#{order._id.substring(0, 6)}</td>
                                            <td>{order.user?.name}</td>
                                            <td>₹{order.totalPrice.toLocaleString()}</td>
                                            <td>
                                                <span className={`status ${order.orderStatus.toLowerCase()}`}>
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    

                    {/* Quick Actions */}
                    <div className="quick-actions">
                        <h2>Quick Actions</h2>
                        <div className="actions-grid">
                            <Link to="/admin/products" className="action-card">
                                <span className="action-icon">🛍️</span>
                                <h3>Manage Products</h3>
                                <p>View, edit, and delete products</p>
                            </Link>

                            <Link to="/admin/users" className="action-card">
                                <span className="action-icon">👥</span>
                                <h3>Manage Users</h3>
                                <p>View and manage user accounts</p>
                            </Link>

                            <Link to="/admin/orders" className="action-card">
                                <span className="action-icon">📦</span>
                                <h3>Manage Orders</h3>
                                <p>View and process orders</p>
                            </Link>

                            <Link to="/admin/product/create" className="action-card">
                                <span className="action-icon">➕</span>
                                <h3>Create Product</h3>
                                <p>Add new products to store</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default AdminDashboard;