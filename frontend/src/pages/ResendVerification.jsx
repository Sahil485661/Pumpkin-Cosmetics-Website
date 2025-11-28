import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../UserStyles/Form.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import Loader from '../components/Loader';

function ResendVerification() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post('/api/v1/resend-verification', { email }, config);

            if (data.success) {
                toast.success(data.message, {
                    position: 'top-center',
                    autoClose: 5000
                });
                setEmail('');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send verification email', {
                position: 'top-center',
                autoClose: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PageTitle title="Resend Verification Email" />
            <Navbar />
            {loading ? (
                <Loader />
            ) : (
                <div className="forgot-container">
                    <div className="container">
                        <div className="form-content">
                            <form className="form" onSubmit={handleSubmit}>
                                <h2>Resend Verification Email</h2>
                                <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
                                    Enter your email address to receive a new verification link.
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
                                <button type="submit" className="authBtn">Send Verification Email</button>
                                <div className="form-links" style={{ marginTop: '15px' }}>
                                    <span 
                                        className="pointer" 
                                        onClick={() => navigate('/login')}
                                        style={{ cursor: 'pointer', color: 'var(--primary-main)' }}
                                    >
                                        Back to Login
                                    </span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}

export default ResendVerification;
