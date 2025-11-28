import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { forgotPassword, clearErrors, clearMessage } from '../features/user/userSlice';
import { toast } from 'react-toastify';
import '../UserStyles/Form.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import Loader from '../components/Loader';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const { loading, error, message } = useSelector((state) => state.user);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(clearErrors());
        }
        if (message) {
            toast.success(message, { position: 'top-center', autoClose: 5000 });
            dispatch(clearMessage());
        }
    }, [error, message, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(forgotPassword(email));
        setEmail('');
    };

    return (
        <>
            <PageTitle title="Forgot Password" />
            <Navbar />
            {loading ? (
                <Loader />
            ) : (
                <div className="forgot-container">
                    <div className="container">
                        <div className="form-content">
                            <form className="form" onSubmit={handleSubmit}>
                                <h2>Forgot Password</h2>
                                <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
                                    Enter your email address and we'll send you a link to reset your password.
                                </p>
                                <div className="input-group email-group">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="authBtn">Send Reset Link</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}

export default ForgotPassword;
