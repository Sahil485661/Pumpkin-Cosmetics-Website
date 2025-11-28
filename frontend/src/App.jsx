import Home from './pages/Home';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails } from './features/user/userSlice'
import { clearCart } from './features/cart/cartSlice' // Import clearCart action
import ProductDetails from './pages/ProductDetails';
import Products from './pages/Products';
import Auth from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import ResendVerification from './pages/ResendVerification';
import Profile from './pages/Profile';
import UpdateProfile from './pages/UpdateProfile';
import UpdatePassword from './pages/UpdatePassword';
import Cart from './pages/Cart';
import Shipping from './pages/Shipping';
import OrderConfirm from './pages/OrderConfirm';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminProducts from './pages/AdminProducts';
import AdminDashboard from './pages/AdminDashboard';
import CreateProduct from './pages/CreateProduct';
import UpdateProduct from './pages/UpdateProduct';
import ProtectedRoute from './components/ProtectedRoute';
import AdminUsers from './pages/AdminUsers';
import AdminOrders from './pages/AdminOrders';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);

  // Clear cart when user logs out (when isAuthenticated changes from true to false)
  const prevAuthRef = React.useRef();
  useEffect(() => {
    if (prevAuthRef.current && prevAuthRef.current === true && !isAuthenticated) {
      dispatch(clearCart());
    }
    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated, dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path='/products' element={<Products />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/login' element={<Auth />} />
        <Route path='/password/forgot' element={<ForgotPassword />} />
        <Route path='/reset/:token' element={<ResetPassword />} />
        <Route path='/verify-email/:token' element={<VerifyEmail />} />
        <Route path='/resend-verification' element={<ResendVerification />} />
        <Route path='/cart' element={<Cart />} />
        
        {/* Protected Routes */}
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path='/admin/dashboard' element={<ProtectedRoute isAdmin={true}><AdminDashboard /></ProtectedRoute>} />
        <Route path='/admin/products' element={<ProtectedRoute isAdmin={true}><AdminProducts /></ProtectedRoute>} />
        <Route path='/admin/users' element={<ProtectedRoute isAdmin={true}><AdminUsers /></ProtectedRoute>} />
        <Route path='/admin/orders' element={<ProtectedRoute isAdmin={true}><AdminOrders /></ProtectedRoute>} />
        <Route path='/admin/product/create' element={<ProtectedRoute isAdmin={true}><CreateProduct /></ProtectedRoute>} />
        <Route path='/admin/product/:id' element={<ProtectedRoute isAdmin={true}><UpdateProduct /></ProtectedRoute>} />
        <Route path='/profile/update' element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
        <Route path='/password/update' element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
        <Route path='/shipping' element={<ProtectedRoute><Shipping /></ProtectedRoute>} />
        <Route path='/order/confirm' element={<ProtectedRoute><OrderConfirm /></ProtectedRoute>} />
        <Route path='/process/payment' element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path='/success' element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
        <Route path='/orders' element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path='/order/:id' element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App