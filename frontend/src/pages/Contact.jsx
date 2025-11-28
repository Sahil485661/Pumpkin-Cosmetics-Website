import React, { useState } from 'react';
import { Container, Box, Typography, Grid, TextField, Button, Card, CardContent } from '@mui/material';
import { LocationOn, Phone, Email, Send } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import '../AboutStyles/Contact.css';
import Footer from '../components/Footer';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error('Please fill all fields', { position: 'top-center' });
            return;
        }

        // Here you can integrate with your backend API
        toast.success('Message sent successfully! We will get back to you soon.', {
            position: 'top-center',
            autoClose: 4000
        });

        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        });
    };

    return (
        <>
            <Navbar />
            <div className="contact-page">
                {/* Hero Section */}
                <section className="contact-hero">
                    <Container maxWidth="lg">
                        <Box className="contact-hero-content">
                            <Typography variant="h2" className="contact-hero-title">
                                Get In Touch
                            </Typography>
                            <Typography variant="body1" className="contact-hero-subtitle">
                                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                            </Typography>
                        </Box>
                    </Container>
                </section>

                {/* Contact Info & Form Section */}
                <section className="contact-content-section">
                    <Container maxWidth="lg">
                        <Grid container spacing={4}>
                            {/* Contact Information Cards */}
                            <Grid item xs={12} md={4}>
                                <div className="contact-info-wrapper">
                                    <Card className="contact-info-card">
                                        <CardContent>
                                            <Box className="contact-icon">
                                                <LocationOn />
                                            </Box>
                                            <Typography variant="h6" className="contact-info-title">
                                                Visit Us
                                            </Typography>
                                            <Typography variant="body2" className="contact-info-text">
                                                Satna Incubation Center<br />
                                                Behind the Collectrate<br />
                                                Dhawari (M.P) 485001
                                            </Typography>
                                        </CardContent>
                                    </Card>

                                    <Card className="contact-info-card">
                                        <CardContent>
                                            <Box className="contact-icon">
                                                <Phone />
                                            </Box>
                                            <Typography variant="h6" className="contact-info-title">
                                                Call Us
                                            </Typography>
                                            <Typography variant="body2" className="contact-info-text">
                                                <a href="tel:+919785943344">+91 9785943344</a>
                                            </Typography>
                                            <Typography variant="body2" className="contact-info-subtitle">
                                                Mon-Fri: 9:00 AM - 6:00 PM
                                            </Typography>
                                        </CardContent>
                                    </Card>

                                    <Card className="contact-info-card">
                                        <CardContent>
                                            <Box className="contact-icon">
                                                <Email />
                                            </Box>
                                            <Typography variant="h6" className="contact-info-title">
                                                Email Us
                                            </Typography>
                                            <Typography variant="body2" className="contact-info-text">
                                                <a href="mailto:support@pumpkin_cosmetics.com">
                                                    support@pumpkin_cosmetics.com
                                                </a>
                                            </Typography>
                                            <Typography variant="body2" className="contact-info-subtitle">
                                                We'll respond within 24 hours
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </div>
                            </Grid>

                            {/* Contact Form */}
                            <Grid item xs={12} md={8}>
                                <Card className="contact-form-card">
                                    <CardContent>
                                        <Typography variant="h4" className="form-title">
                                            Send Us a Message
                                        </Typography>
                                        <Typography variant="body2" className="form-subtitle">
                                            Have a question or feedback? Fill out the form below and we'll get back to you shortly.
                                        </Typography>

                                        <form onSubmit={handleSubmit} className="contact-form">
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Your Name"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        variant="outlined"
                                                        required
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Your Email"
                                                        name="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        variant="outlined"
                                                        required
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Subject"
                                                        name="subject"
                                                        value={formData.subject}
                                                        onChange={handleChange}
                                                        variant="outlined"
                                                        required
                                                    />
                                                </Grid>
                                                
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Message"
                                                        name="message"
                                                        value={formData.message}
                                                        onChange={handleChange}
                                                        variant="outlined"
                                                        multiline
                                                        rows={6}
                                                        required
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        size="large"
                                                        className="submit-button"
                                                        startIcon={<Send />}
                                                    >
                                                        Send Message
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </form>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Container>
                </section>

                {/* Map Section (Optional - You can add Google Maps integration) */}
                <section className="map-section">
                    <Container maxWidth="lg">
                        <Box className="map-container">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3626.0!2d80.8302!3d24.5847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDM1JzA0LjkiTiA4MMKwNDknNDguNyJF!5e0!3m2!1sen!2sin!4v1234567890"
                                width="100%"
                                height="450"
                                style={{ border: 0, borderRadius: '12px' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Pumpkin Cosmetics Location"
                            ></iframe>
                        </Box>
                    </Container>
                </section>
            </div>

            <Footer />
        </>
    );
}

export default Contact;
