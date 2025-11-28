import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import '../pageStyles/Home.css';
import Navbar from '../components/Navbar';
import ImageSlider from '../components/ImageSlider';
import Product from '../components/Product';
import PageTitle from '../components/PageTitle';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, removeErrors } from '../features/products/productSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

function Home() {
  const { loading, error, products, productCount, totalPages, currentPage } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getProduct(page));
  }, [dispatch, page]);

  useEffect(() => {
    if(error){
      toast.error(error.message, {position: toast.POSITION.TOP_CENTER, autoClose:2000});
      dispatch(removeErrors());
    }
  },[dispatch, error]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <>
    {loading ? (<Loader/>) : (<>  
      <PageTitle title="Home"/>
      <Navbar/>
      <ImageSlider />
      <div className="home-container">
        <h2 className="home-heading">Trending Products</h2>
        <div className="home-product-container">
          {Array.isArray(products) && products.map((product, index) => (
            <Product product={product} key={index} />
          ))}
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination-controls">
            <button 
              onClick={handlePrevPage} 
              disabled={page === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            
            <span className="pagination-info">
              Page {currentPage} of {totalPages} (Total: {productCount} products)
            </span>
            
            <button 
              onClick={handleNextPage} 
              disabled={page === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>)}
    </>
  );
}

export default Home;