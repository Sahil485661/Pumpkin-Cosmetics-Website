import React from 'react';
import { Container, Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { Nature, Science, Star, Spa } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import '../AboutStyles/About.css';
import Footer from '../components/Footer';

function About() {
    return (
        <>
            <Navbar />
            <div className="about-page">
                {/* Hero Section */}
                <section className="about-hero">
                    <div className="hero-overlay">
                        <Container maxWidth="lg">
                            <Box className="hero-content">
                                <Typography variant="overline" className="hero-subtitle">
                                    Where Science Meets Serenity
                                </Typography>
                                <Typography variant="h2" className="hero-title">
                                    Redefining the Standard of Beauty.
                                </Typography>
                                <Typography variant="body1" className="hero-description">
                                    At Pumpkin Cosmetics, we believe that true luxury is found in results. 
                                    We were founded on a singular principle: that you should never have to 
                                    choose between clinical efficacy and botanical purity.
                                </Typography>
                                <Typography variant="body1" className="hero-description-secondary">
                                    We create high-performance skincare powered by a sophisticated blend of 
                                    proven actives and potent natural ingredients. Our formulas are designed 
                                    not just to care for your skin, but to transform it.
                                </Typography>
                            </Box>
                        </Container>
                    </div>
                </section>

                {/* Philosophy Section */}
                <section className="philosophy-section">
                    <Container maxWidth="lg">
                        <Box className="section-header">
                            <Typography variant="h3" className="section-title">
                                The Intersection of Nature & Science
                            </Typography>
                            <Typography variant="body1" className="section-intro">
                                In a world of endless choices, we stand for clarity and quality. 
                                Our approach is uncompromising:
                            </Typography>
                        </Box>

                        <Grid container spacing={4} className="values-grid">
                            <Grid item xs={12} md={4}>
                                <Card className="value-card">
                                    <CardContent>
                                        <Box className="value-icon">
                                            <Nature fontSize="large" />
                                        </Box>
                                        <Typography variant="h5" className="value-title">
                                            Clean Formulations
                                        </Typography>
                                        <Typography variant="body2" className="value-description">
                                            We banish harsh chemicals in favor of skin-loving ingredients 
                                            that nourish and protect.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Card className="value-card">
                                    <CardContent>
                                        <Box className="value-icon">
                                            <Science fontSize="large" />
                                        </Box>
                                        <Typography variant="h5" className="value-title">
                                            Proven Actives
                                        </Typography>
                                        <Typography variant="body2" className="value-description">
                                            We utilize gold-standard scientific ingredients known to deliver 
                                            visible, anti-aging, and restorative benefits.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Card className="value-card">
                                    <CardContent>
                                        <Box className="value-icon">
                                            <Star fontSize="large" />
                                        </Box>
                                        <Typography variant="h5" className="value-title">
                                            Honest Beauty
                                        </Typography>
                                        <Typography variant="body2" className="value-description">
                                            Transparency is our luxury. We provide skincare you can trust, 
                                            with no hidden fillers—just potent, honest ingredients.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Container>
                </section>

                {/* Brand Promise Section */}
                <section className="promise-section">
                    <Container maxWidth="md">
                        <Box className="promise-content">
                            <Spa className="promise-icon" />
                            <Typography variant="h3" className="promise-quote">
                                "Real Results. Honest Beauty."
                            </Typography>
                            <Typography variant="body1" className="promise-text">
                                We understand that your skin deserves the best. That is why every bottle, 
                                jar, and serum we produce is a testament to quality. We focus on real 
                                results that you can see and feel.
                            </Typography>
                            <Typography variant="body1" className="promise-text">
                                Whether you are seeking hydration, radiance, or restoration, Pumpkin 
                                Cosmetics is your partner in the pursuit of a flawless complexion.
                            </Typography>
                        </Box>
                    </Container>
                </section>

                {/* Footer Sign-off */}
                <section className="signoff-section">
                    <Container maxWidth="lg">
                        <Box className="signoff-content">
                            <Typography variant="h4" className="signoff-text">
                                Elevate your ritual. Glow better, every day.
                            </Typography>
                        </Box>
                    </Container>
                </section>
            </div>
            <Footer />
        </>
    );
}

export default About;
