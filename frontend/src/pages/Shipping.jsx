import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingInfo } from '../features/cart/cartSlice';
import { toast } from 'react-toastify';
import '../CartStyles/Shipping.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';

function Shipping() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { shippingInfo } = useSelector((state) => state.cart);

    const [formData, setFormData] = useState({
        address: shippingInfo.address || '',
        city: shippingInfo.city || '',
        state: shippingInfo.state || '',
        country: shippingInfo.country || '',
        pinCode: shippingInfo.pinCode || '',
        phoneNo: shippingInfo.phoneNo || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.phoneNo.length !== 10) {
            toast.error('Phone number must be 10 digits', { position: 'top-center', autoClose: 3000 });
            return;
        }
        if (formData.pinCode.length !== 6) {
            toast.error('Pin code must be 6 digits', { position: 'top-center', autoClose: 3000 });
            return;
        }
        dispatch(saveShippingInfo(formData));
        navigate('/order/confirm');
    };

    return (
        <>
            <PageTitle title="Shipping Details" />
            <Navbar />
            <div className="shipping-container">
                <div className="shipping-form-wrapper">
                    <h2 className="shipping-heading">Shipping Details</h2>
                    <form className="shipping-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Address"
                                required
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="City"
                                required
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="State"
                                required
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Country"
                                required
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="number"
                                placeholder="Pin Code"
                                required
                                value={formData.pinCode}
                                onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="number"
                                placeholder="Phone Number"
                                required
                                value={formData.phoneNo}
                                onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="shipping-btn">Continue</button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Shipping;
