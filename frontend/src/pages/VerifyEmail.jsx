import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CheckCircle, Error } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import Loader from '../components/Loader';
import '../CartStyles/PaymentSuccess.css';

function VerifyEmail() {
    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [verifying, setVerifying] = useState(true);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifyEmailToken = async () => {
            try {
                const { data } = await axios.get(`/api/v1/verify-email/${token}`, {
                    withCredentials: true
                });
                
                if (data.success) {
                    setVerified(true);
                    toast.success('Email verified successfully! You can now login.', {
                        position: 'top-center',
                        autoClose: 3000
                    });
                    
                    // Redirect to home after 3 seconds
                    setTimeout(() => {
                        navigate('/');
                    }, 3000);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Verification failed');
                toast.error(err.response?.data?.message || 'Verification failed', {
                    position: 'top-center',
                    autoClose: 5000
                });
            } finally {
                setVerifying(false);
            }
        };

        if (token) {
            verifyEmailToken();
        }
    }, [token, navigate, dispatch]);

    return (
        <>
            <PageTitle title="Email Verification" />
            <Navbar />
            {verifying ? (
                <div className="success-container">
                    <div className="success-content">
                        <Loader />
                        <h1>Verifying your email...</h1>
                        <p>Please wait while we verify your email address.</p>
                    </div>
                </div>
            ) : verified ? (
                <div className="success-container">
                    <div className="success-content">
                        <CheckCircle className="success-icon" style={{ fontSize: '80px', color: 'green' }} />
                        <h1>Email Verified Successfully!</h1>
                        <p>Your account has been verified. You can now access all features.</p>
                        <p style={{ marginTop: '20px', color: '#666' }}>Redirecting to home page...</p>
                    </div>
                </div>
            ) : (
                <div className="success-container">
                    <div className="success-content">
                        <Error className="success-icon" style={{ fontSize: '80px', color: 'red' }} />
                        <h1>Verification Failed</h1>
                        <p>{error || 'The verification link is invalid or has expired.'}</p>
                        <div className="success-actions" style={{ marginTop: '30px' }}>
                            <button 
                                onClick={() => navigate('/login')}
                                className="view-orders-btn"
                            >
                                Go to Login
                            </button>
                            <button 
                                onClick={() => navigate('/resend-verification')}
                                className="continue-shopping-btn"
                            >
                                Resend Verification Email
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}

export default VerifyEmail;
