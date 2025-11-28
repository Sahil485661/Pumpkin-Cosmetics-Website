import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updatePassword, clearErrors, clearMessage } from '../features/user/userSlice';
import { toast } from 'react-toastify';
import '../UserStyles/Form.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import Loader from '../components/Loader';

function UpdatePassword() {
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, message, isAuthenticated } = useSelector((state) => state.user);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(clearErrors());
        }
        if (message) {
            toast.success(message, { position: 'top-center', autoClose: 3000 });
            dispatch(clearMessage());
            navigate('/profile');
        }
    }, [error, message, dispatch, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("Passwords don't match", { position: 'top-center', autoClose: 3000 });
            return;
        }
        dispatch(updatePassword(passwords));
        setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    };

    return (
        <>
            <PageTitle title="Update Password" />
            <Navbar />
            {loading ? (
                <Loader />
            ) : (
                <div className="update-container">
                    <div className="container">
                        <div className="form-content">
                            <form className="form" onSubmit={handleSubmit}>
                                <h2>Change Password</h2>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        placeholder="Old Password"
                                        required
                                        value={passwords.oldPassword}
                                        onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        placeholder="New Password (min 8 characters)"
                                        required
                                        value={passwords.newPassword}
                                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        placeholder="Confirm New Password"
                                        required
                                        value={passwords.confirmPassword}
                                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="authBtn">Update Password</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}

export default UpdatePassword;
