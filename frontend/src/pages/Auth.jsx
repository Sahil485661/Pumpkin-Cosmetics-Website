import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, clearErrors, clearMessage } from '../features/user/userSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../UserStyles/Form.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import Loader from '../components/Loader';

function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
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

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(loginData));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', registerData.name);
        formData.append('email', registerData.email);
        formData.append('password', registerData.password);
        if (avatar) {
            formData.append('avatar', avatar);
        }
        
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.post('/api/v1/register', formData, config);
            
            if (data.success) {
                setRegistrationSuccess(true);
                toast.success(data.message, { position: 'top-center', autoClose: 5000 });
                setRegisterData({ name: '', email: '', password: '' });
                setAvatar(null);
                setAvatarPreview('');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed', {
                position: 'top-center',
                autoClose: 3000
            });
        }
    };

    return (
        <>
            <PageTitle title={isLogin ? "Login" : "Register"} />
            <Navbar />
            {loading ? (
                <Loader />
            ) : (
                <div className="form-container">
                    <div className="container">
                        {registrationSuccess ? (
                            <div className="form-content">
                                <div className="form" style={{ textAlign: 'center' }}>
                                    <h2>Check Your Email!</h2>
                                    <p style={{ margin: '20px 0', color: '#666', lineHeight: '1.6' }}>
                                        We've sent a verification link to your email address.
                                        Please click the link to verify your account and complete registration.
                                    </p>
                                    <p style={{ margin: '20px 0', color: '#666', fontSize: '14px' }}>
                                        Didn't receive the email?
                                    </p>
                                    <button 
                                        className="authBtn" 
                                        onClick={() => navigate('/resend-verification')}
                                        style={{ marginBottom: '10px' }}
                                    >
                                        Resend Verification Email
                                    </button>
                                    <div className="form-links">
                                        <span className="pointer" onClick={() => {
                                            setRegistrationSuccess(false);
                                            setIsLogin(true);
                                        }}>
                                            Back to Login
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                        <div className="form-content">
                            {isLogin ? (
                                <form className="form" onSubmit={handleLoginSubmit}>
                                    <h2>Login</h2>
                                    <div className="input-group">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            required
                                            value={loginData.email}
                                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            required
                                            value={loginData.password}
                                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        />
                                    </div>
                                    <button type="submit" className="authBtn">Login</button>
                                    <div className="form-links">
                                        <Link to="/password/forgot">Forgot Password?</Link>
                                    </div>
                                    <div className="form-links">
                                        Don't have an account?
                                        <span className="pointer" onClick={() => setIsLogin(false)}> Register</span>
                                    </div>
                                </form>
                            ) : (
                                <form className="form" onSubmit={handleRegisterSubmit}>
                                    <h2>Register</h2>
                                    <div className="input-group avatar-group">
                                        {avatarPreview && (
                                            <img 
                                                src={avatarPreview} 
                                                alt="Avatar Preview" 
                                                className="avatar"
                                            />
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="file-input"
                                            onChange={handleAvatarChange}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            required
                                            value={registerData.name}
                                            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            required
                                            value={registerData.email}
                                            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <input
                                            type="password"
                                            placeholder="Password (min 8 characters)"
                                            required
                                            value={registerData.password}
                                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                        />
                                    </div>
                                    <button type="submit" className="authBtn">Register</button>
                                    <div className="form-links">
                                        Already have an account?
                                        <span className="pointer" onClick={() => setIsLogin(true)}> Login</span>
                                    </div>
                                </form>
                            )}
                        </div>
                        )}
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}

export default Auth;
