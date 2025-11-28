import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserDetails, clearErrors, clearMessage } from '../features/user/userSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../UserStyles/Form.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import Loader from '../components/Loader';

function UpdateProfile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, error, message, isAuthenticated } = useSelector((state) => state.user);
    
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else if (user) {
            setFormData({ name: user.name, email: user.email });
            setAvatarPreview(user.avatar?.url || '');
        }
    }, [user, isAuthenticated, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(clearErrors());
        }
        if (message) {
            toast.success(message, { position: 'top-center', autoClose: 3000 });
            dispatch(clearMessage());
            dispatch(getUserDetails());
            navigate('/profile');
        }
    }, [error, message, dispatch, navigate]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        if (avatar) {
            formDataToSend.append('avatar', avatar);
        }
        
        try {
            const config = { 
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true 
            };
            const { data } = await axios.put('/api/v1/profile/update', formDataToSend, config);
            
            if (data.success) {
                toast.success(data.message, { position: 'top-center', autoClose: 3000 });
                dispatch(getUserDetails());
                navigate('/profile');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Profile update failed', {
                position: 'top-center',
                autoClose: 3000
            });
        }
    };

    return (
        <>
            <PageTitle title="Update Profile" />
            <Navbar />
            {loading ? (
                <Loader />
            ) : (
                <div className="update-container">
                    <div className="container">
                        <div className="form-content">
                            <form className="form" onSubmit={handleSubmit}>
                                <h2>Update Profile</h2>
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
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="authBtn">Update Profile</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}

export default UpdateProfile;
