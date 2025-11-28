import React from 'react'
import '../componentStyles/Footer.css'
import { Phone, Mail, GitHub, LinkedIn, Instagram, WhatsApp, AddHome, Home } from '@mui/icons-material'
function Footer() {
    return (
        <footer className='footer'>
            <div className='footer-container'>
                {/* Section-1 */}
                <div className='footer-section contact'>
                    <h3>Contact Us</h3>
                    <p><Home/>Address: Satna Incubation Center Behind the Collectrate Dhawari (M.P) 485001</p>
                    <p><Phone fontSize='small' />Phone: 9785943344</p>
                    <p><Mail fontSize='small' />Email: support@pumpkin_cosmetics.com</p>
                </div>
                {/* Section-2 */}
                <div className='footer-section social'>
                    <h3>Follow Us</h3>
                    <div className='social-links'>
                        <a href="" target='_blank'>
                            <GitHub className='social-icon' />
                        </a>
                        <a href="" target='_blank'>
                            <LinkedIn className='social-icon' />
                        </a>
                        <a href="" target='_blank'>
                            <Instagram className='social-icon' />
                        </a>
                        <a href="" target='_blank'>
                            <WhatsApp className='social-icon' />
                        </a>
                    </div>
                </div>
                {/* Section-3 */}
                <div className="footer-section about">
                    <h3>About Us</h3>
                    <p>Pumpkin Cosmetics creates high-performance skincare powered by proven actives and natural ingredients. We focus on real results, clean formulations, and honest beauty you can trust. Glow better, every day.</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Pumpkin Cosmetics. All rights reserved</p>
            </div>
        </footer>
    )
}

export default Footer