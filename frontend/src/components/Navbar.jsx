import React, { useState, useEffect } from 'react'
import '../componentStyles/Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { Close, Menu, PersonAdd, Search, ShoppingCart, Person, Logout, Dashboard } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails, logoutUser } from '../features/user/userSlice'
import { clearCart } from '../features/cart/cartSlice' // Import clearCart action
import '../pageStyles/Search.css'
import '../UserStyles/UserDashboard.css'


function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const { cartItems } = useSelector((state) => state.cart);
    
    useEffect(() => {
        if (isAuthenticated && !user) {
            dispatch(getUserDetails());
        }
    }, [isAuthenticated, user, dispatch]);
    
    const toggleSearch= () => setIsSearchOpen(!isSearchOpen)
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if(searchQuery.trim()) {
            navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);

        }else{
            navigate(`/products`);
        }
        setSearchQuery(' ');
    }
  return (
    <nav className="navbar">
        <div className="navbar-container">
            <div className='navbar-logo'>
                <Link to="/" onClick={()=>setIsMenuOpen(false)}><img src="/images/logo.png" alt="" /></Link>
            </div>
            <div className={`navbar-links ${isMenuOpen?'active':''}`}>
                <ul>
                    <li onClick={()=>setIsMenuOpen(false)}><Link to ="/">Home</Link></li>
                    <li><Link to ="/products">Products</Link></li>
                    <li><Link to ="/about">About Us</Link></li>
                    <li><Link to ="/contact">Contact Us</Link></li>
                </ul>
            </div>
            <div className="navbar-icons">
                <div className="search-container">
                    <form className={`search-form ${isSearchOpen?'active':''}`} onSubmit={handleSearchSubmit}>
                        <input type="text"
                        className='search-input'
                        value={searchQuery}
                        onChange={(e)=> setSearchQuery(e.target.value)}
                        placeholder='Search Product' />
                        <button type='button' className="search-icon" onClick={toggleSearch}>
                            <Search focusable= 'false'/>
                        </button>
                    </form>
                </div>
                <div className="cart-container">
                    <Link to="/cart">
                    <ShoppingCart className='icon'/>
                    {cartItems.length > 0 && <span className='cart-badge'>{cartItems.length}</span>}
                    </Link>
                </div>
                {!isAuthenticated ? (
                    <Link to='/login' className='register-link'>
                        <PersonAdd className='icon'/>
                    </Link>
                ) : (
                    <div className="profile-header" onClick={() => setShowUserMenu(!showUserMenu)}>
                        <img 
                            src={user?.avatar?.url || '/images/default-avatar.png'} 
                            alt="Profile" 
                            className="profile-avatar" 
                        />
                        <span className="profile-name">{user?.name?.split(' ')[0]}</span>
                    </div>
                )}
                <div className="navbar-hamburger " onClick={toggleMenu}>
                    {isMenuOpen?<Close className='icon'/>:<Menu className='icon'/>}
                </div>
            </div>
        </div>
        {showUserMenu && isAuthenticated && (
            <>
                <div className="overlay show" onClick={() => setShowUserMenu(false)}></div>
                <div className="menu-options">
                    {user?.role === 'admin' && (
                        <button className="menu-option-btn" onClick={() => {
                            navigate('/admin/dashboard');
                            setShowUserMenu(false);
                        }}>
                            <Dashboard fontSize="small" /> Dashboard
                        </button>
                    )}
                    <button className="menu-option-btn" onClick={() => {
                        navigate('/profile');
                        setShowUserMenu(false);
                    }}>
                        <Person fontSize="small" /> Profile
                    </button>
                    <button className="menu-option-btn" onClick={() => {
                        navigate('/orders');
                        setShowUserMenu(false);
                    }}>
                        <ShoppingCart fontSize="small" /> Orders
                    </button>
                    <button className="menu-option-btn" onClick={() => {
                        dispatch(logoutUser());
                        dispatch(clearCart()); // Clear cart on logout
                        setShowUserMenu(false);
                        navigate('/');
                    }}>
                        <Logout fontSize="small" /> Logout
                    </button>
                </div>
            </>
        )}
    </nav>
  )
}

export default Navbar