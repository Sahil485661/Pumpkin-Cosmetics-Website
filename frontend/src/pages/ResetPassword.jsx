import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { resetPassword, clearErrors, clearMessage } from '../features/user/userSlice';
import { toast } from 'react-toastify';
import '../UserStyles/Form.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import Loader from '../components/Loader';

function ResetPassword() {
    const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useParams();
    const { loading, error, isAuthenticated, message } = useSelector((state) => state.user);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(clearErrors());
        }
        if (message) {
            toast.success(message, { position: 'top-center', autoClose: 3000 });
            dispatch(clearMessage());
        }
        if (isAuthenticated) {
            navigate('/');
        }
    }, [error, message, isAuthenticated, dispatch, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (passwords.password !== passwords.confirmPassword) {
            toast.error("Passwords don't match", { position: 'top-center', autoClose: 3000 });
            return;
        }
        dispatch(resetPassword({ token, passwords }));
    };

    return (
        <>
            <PageTitle title="Reset Password" />
            <Navbar />
            {loading ? (
                <Loader />
            ) : (
                <div className="update-container">
                    <div className="container">
                        <div className="form-content">
                            <form className="form" onSubmit={handleSubmit}>
                                <h2>Reset Password</h2>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        placeholder="New Password (min 8 characters)"
                                        required
                                        value={passwords.password}
                                        onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
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
                                <button type="submit" className="authBtn">Reset Password</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}

export default ResetPassword;
