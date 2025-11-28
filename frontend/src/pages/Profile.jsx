import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getUserDetails } from '../features/user/userSlice';
import '../UserStyles/Profile.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import Loader from '../components/Loader';

function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, isAuthenticated } = useSelector((state) => state.user);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            dispatch(getUserDetails());
        }
    }, [dispatch, isAuthenticated, navigate]);

    return (
        <>
            <PageTitle title="My Profile" />
            <Navbar />
            {loading ? (
                <Loader />
            ) : (
                user && (
                    <div className="profile-container">
                        <h1 className="profile-heading">{user.role === 'admin' ? 'Admin Profile' : 'My Profile'}</h1>
                        <div className="profile-image">
                            <img 
                                src={user.avatar?.url || '/images/default-avatar.png'} 
                                alt="User Profile" 
                            />
                            <Link to="/profile/update">Edit Profile</Link>
                        </div>
                        <div className="profile-details">
                            <div className="profile-detail">
                                <h2>Full Name:</h2>
                                <p>{user.name}</p>
                            </div>
                            <div className="profile-detail">
                                <h2>Email:</h2>
                                <p>{user.email}</p>
                            </div>
                            <div className="profile-detail">
                                <h2>Role:</h2>
                                <p style={{ 
                                    textTransform: 'capitalize', 
                                    color: user.role === 'admin' ? '#e74c3c' : '#2c3e50',
                                    fontWeight: user.role === 'admin' ? '600' : '400'
                                }}>
                                    {user.role || 'User'}
                                </p>
                            </div>
                            <div className="profile-detail">
                                <h2>Joined On:</h2>
                                <p>{String(user.createdAt).substr(0, 10)}</p>
                            </div>
                        </div>
                        
                        {/* Admin specific buttons */}
                        {user.role === 'admin' && (
                            <div className="profile-buttons admin-buttons">
                                <h3 style={{ width: '100%', marginBottom: '15px', color: '#2c3e50' }}>Admin Panel</h3>
                                <Link to="/admin/dashboard" className="admin-link">Admin Dashboard</Link>
                                <Link to="/admin/products" className="admin-link">Manage Products</Link>
                                <Link to="/admin/users" className="admin-link">Manage Users</Link>
                                <Link to="/admin/orders" className="admin-link">Manage Orders</Link>
                            </div>
                        )}
                        
                        {/* Regular user buttons */}
                        <div className="profile-buttons">
                            <Link to="/orders">My Orders</Link>
                            <Link to="/password/update">Change Password</Link>
                        </div>
                    </div>
                )
            )}
            <Footer />
        </>
    );
}

export default Profile;
