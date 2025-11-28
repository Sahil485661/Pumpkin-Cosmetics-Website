import React, { useEffect, useState } from 'react'
import '../pageStyles/Products.css'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Product from '../components/Product';
import { getProduct, removeErrors, setKeyword, setCategory, setPriceRange } from '../features/products/productSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import axios from 'axios';
import Footer from '../components/Footer';

function Products() {
    const [searchParams] = useSearchParams();
    const [categories, setCategories] = useState([]);
    const [localCategory, setLocalCategory] = useState('');
    const [localPriceRange, setLocalPriceRange] = useState([0, 10000]);
    const [currentPage, setCurrentPage] = useState(1);
    
    const { loading, error, products, totalPages, currentPage: page, keyword, category, price } = useSelector((state) => state.product);
    const dispatch = useDispatch();
    
    const urlKeyword = searchParams.get('keyword') || '';
    
    useEffect(() => {
        // Fetch categories
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('/api/v1/products');
                const uniqueCategories = [...new Set(data.products.map(p => p.category))];
                setCategories(uniqueCategories);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCategories();
    }, []);
    
    // Update Redux state when URL keyword changes
    useEffect(() => {
        if (urlKeyword !== keyword) {
            dispatch(setKeyword(urlKeyword));
            setCurrentPage(1); // Reset to first page when search changes
        }
    }, [urlKeyword, keyword, dispatch]);
    
    // Update Redux state when local category changes
    useEffect(() => {
        if (localCategory !== category) {
            dispatch(setCategory(localCategory));
            setCurrentPage(1); // Reset to first page when category changes
        }
    }, [localCategory, category, dispatch]);
    
    // Update Redux state when local price range changes
    useEffect(() => {
        const newPriceRange = { gte: localPriceRange[0], lte: localPriceRange[1] };
        if (newPriceRange.gte !== price.gte || newPriceRange.lte !== price.lte) {
            dispatch(setPriceRange(newPriceRange));
            setCurrentPage(1); // Reset to first page when price range changes
        }
    }, [localPriceRange, price, dispatch]);
    
    // Fetch products when filters or page changes
    useEffect(() => {
        dispatch(getProduct(currentPage));
    }, [dispatch, currentPage, keyword, category, price]);
    
    useEffect(() => {
        if(error){
          toast.error(error.message, {position: toast.POSITION.TOP_CENTER, autoClose:2000});
          dispatch(removeErrors());
        }
    },[dispatch, error]);
    
    // Reset filters
    const resetFilters = () => {
        setLocalCategory('');
        setLocalPriceRange([0, 10000]);
        setCurrentPage(1);
    };
    
  return (
    <>
    {loading?(<Loader/>):(<>
    <PageTitle title="All Products"/>
    <Navbar/>
    <div className="products-layout">
        <div className="filter-section">
            <h3 className="filter-heading">FILTERS</h3>
            
            <div className="filter-group">
                <h4>CATEGORIES</h4>
                <div className="category-list">
                    <button 
                        className={`category-item ${localCategory === '' ? 'active' : ''}`}
                        onClick={() => setLocalCategory('')}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button 
                            key={cat}
                            className={`category-item ${localCategory === cat ? 'active' : ''}`}
                            onClick={() => setLocalCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="filter-group">
                <h4>PRICE RANGE</h4>
                <div className="price-inputs">
                    <input 
                        type="number" 
                        placeholder="Min" 
                        value={localPriceRange[0]}
                        onChange={(e) => setLocalPriceRange([Number(e.target.value), localPriceRange[1]])}
                    />
                    <span>-</span>
                    <input 
                        type="number" 
                        placeholder="Max" 
                        value={localPriceRange[1]}
                        onChange={(e) => setLocalPriceRange([localPriceRange[0], Number(e.target.value)])}
                    />
                </div>
            </div>
            
            <button className="reset-filters-btn" onClick={resetFilters}>
                Reset Filters
            </button>
        </div>
        <div className="products-section">
            <div className="products-product-container">
                {products && products.length > 0 ? (
                    products.map((product) => (<Product product={product} key={product._id} />))
                ) : (
                    <p style={{ textAlign: 'center', padding: '20px' }}>No products found</p>
                )}
            </div>
            {totalPages > 1 && (
                <div className="pagination">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            className={currentPage === index + 1 ? 'active' : ''}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    </div>
    <Footer/>
    </>)}
    </>
  )
}

export default Products