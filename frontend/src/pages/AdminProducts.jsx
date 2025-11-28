import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../AdminStyles/ProductsList.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import Loader from '../components/Loader';

function AdminProducts() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading: userLoading, isAuthenticated } = useSelector((state) => state.user);
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'admin') {
            navigate('/profile');
        } else {
            fetchProducts(currentPage, searchTerm);
        }
    }, [isAuthenticated, user, navigate, currentPage]);
    
    // Reset to first page when search term changes
    useEffect(() => {
        setCurrentPage(1);
        fetchProducts(1, searchTerm);
    }, [searchTerm]);
    
    const fetchProducts = async (page = 1, search = '') => {
        try {
            setLoading(true);
            let url = `/api/v1/admin/products?page=${page}`;
            
            if (search) {
                url += `&keyword=${search}`;
            }
            
            const response = await axios.get(url, {
                withCredentials: true
            });
            
            if (response.data.success) {
                setProducts(response.data.products);
                setTotalProducts(response.data.productCount);
                setTotalPages(response.data.totalPages);
                setCurrentPage(response.data.currentPage);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch products');
            toast.error(error.response?.data?.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            try {
                const response = await axios.delete(`/api/v1/admin/product/${id}`, {
                    withCredentials: true
                });
                
                if (response.data.success) {
                    toast.success('Product deleted successfully');
                    fetchProducts(currentPage, searchTerm); // Refresh the current page
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete product');
            }
        }
    };
    
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    // Pagination controls
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    if (userLoading || loading) {
        return <Loader />;
    }

    if (!isAuthenticated || user?.role !== 'admin') {
        return null;
    }

    return (
        <>
            <PageTitle title="Admin Products" />
            <Navbar />
            <div className="product-list-container">
                <div className="admin-header">
                    <h1 className="product-list-title">Manage Products</h1>
                    <Link to="/admin/product/create" className="admin-btn primary">
                        Create New Product
                    </Link>
                </div>
                
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="admin-content">
                    {products.length === 0 ? (
                        <div className="no-products">
                            <h3>No products found</h3>
                            <p>Start by creating your first product.</p>
                            <Link to="/admin/product/create" className="admin-btn primary">
                                Create Product
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="products-table">
                                <table className="product-table">
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            <th>Category</th>
                                            <th>Date Added</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                            <tr key={product._id}>
                                                <td>
                                                    <img 
                                                        src={product.image[0]?.url || '/images/default-product.png'} 
                                                        alt={product.name}
                                                        className="admin-product-image"
                                                    />
                                                </td>
                                                <td>{product.name}</td>
                                                <td>₹{product.price}</td>
                                                <td>
                                                    <span className={product.stock === 0 ? 'out-of-stock' : ''}>
                                                        {product.stock}
                                                    </span>
                                                </td>
                                                <td>{product.category}</td>
                                                <td>{formatDate(product.createdAt)}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <Link 
                                                            to={`/admin/product/${product._id}`} 
                                                            className="admin-btn secondary"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button 
                                                            onClick={() => deleteProduct(product._id)}
                                                            className="admin-btn danger"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="pagination-controls">
                                    <button 
                                        onClick={handlePrevPage} 
                                        disabled={currentPage === 1}
                                        className="pagination-btn"
                                    >
                                        Previous
                                    </button>
                                    
                                    <span className="pagination-info">
                                        Page {currentPage} of {totalPages} (Total: {totalProducts} products)
                                    </span>
                                    
                                    <button 
                                        onClick={handleNextPage} 
                                        disabled={currentPage === totalPages}
                                        className="pagination-btn"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default AdminProducts;