import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../AdminStyles/UpdateProduct.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import Loader from '../components/Loader';

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]); // Track images to be deleted
    
    const [loading, setLoading] = useState(false);
    const [productLoading, setProductLoading] = useState(false);
    
    const categories = [
        "Makeup", "Skincare", "Haircare", "Fragrance", "Nails", "Tools", "Bath & Body", "Gift Sets"
    ];
    
    useEffect(() => {
        const getProductDetails = async () => {
            try {
                setProductLoading(true);
                const response = await axios.get(`/api/v1/product/${id}`, {
                    withCredentials: true
                });
                
                const product = response.data.product;
                setName(product.name);
                setPrice(product.price);
                setDescription(product.description);
                setCategory(product.category);
                setStock(product.stock);
                setOldImages(product.image);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error fetching product details');
            } finally {
                setProductLoading(false);
            }
        };
        
        getProductDetails();
    }, [id]);
    
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        // Don't clear existing images, allow adding more
        files.forEach((file) => {
            const reader = new FileReader();
            
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((old) => [...old, reader.result]);
                    setImages((old) => [...old, file]);
                }
            };
            
            reader.readAsDataURL(file);
        });
    };
    
    const handleRemoveOldImage = (index) => {
        const updatedOldImages = [...oldImages];
        const removedImage = updatedOldImages.splice(index, 1);
        setOldImages(updatedOldImages);
        setDeletedImages((prev) => [...prev, removedImage[0].public_id]);
    };
    
    const handleRemoveNewImage = (index) => {
        const updatedImages = [...images];
        const updatedPreview = [...imagesPreview];
        updatedImages.splice(index, 1);
        updatedPreview.splice(index, 1);
        setImages(updatedImages);
        setImagesPreview(updatedPreview);
    };
    
    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            
            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price);
            formData.append('description', description);
            formData.append('category', category);
            formData.append('stock', stock);
            
            // Append deleted images
            deletedImages.forEach((id) => {
                formData.append('imagesToDelete', id);
            });
            
            // Append new images
            images.forEach((image) => {
                formData.append('images', image);
            });
            
            const response = await axios.put(`/api/v1/admin/product/${id}`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if (response.data.success) {
                toast.success('Product updated successfully');
                navigate('/admin/products');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating product');
        } finally {
            setLoading(false);
        }
    };
    
    if (productLoading) {
        return <Loader />;
    }
    
    return (
        <>
            <PageTitle title="Update Product" />
            <Navbar />
            <div className="update-product-wrapper">
                <h1 className="update-product-title">Update Product</h1>
                
                <form 
                    className="update-product-form" 
                    encType="multipart/form-data"
                    onSubmit={handleUpdateProduct}
                >
                    <div>
                        <label htmlFor="name">Product Name</label>
                        <input
                            className="update-product-input"
                            type="text"
                            placeholder="Product Name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="price">Price</label>
                        <input
                            className="update-product-input"
                            type="number"
                            placeholder="Price"
                            required
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="description">Description</label>
                        <textarea
                            className="update-product-textarea"
                            placeholder="Product Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            cols="30"
                            rows="1"
                        ></textarea>
                    </div>
                    
                    <div>
                        <label htmlFor="category">Category</label>
                        <select
                            className="update-product-select"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Choose Category</option>
                            {categories.map((cate) => (
                                <option key={cate} value={cate}>
                                    {cate}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label htmlFor="stock">Stock</label>
                        <input
                            className="update-product-input"
                            type="number"
                            placeholder="Stock"
                            required
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="images">Product Images</label>
                        <div className="update-product-file-wrapper">
                            <input
                                className="update-product-file-input"
                                type="file"
                                name="images"
                                accept="image/*"
                                onChange={handleImageChange}
                                multiple
                            />
                        </div>
                    </div>
                    
                    {/* Old Images Section */}
                    <div>
                        <label>Existing Images</label>
                        <div className="update-product-old-images-wrapper">
                            {oldImages &&
                                oldImages.map((image, index) => (
                                    <div key={index} className="image-container">
                                        <img
                                            className="update-product-old-image"
                                            src={image.url}
                                            alt="Old Product"
                                        />
                                        <button 
                                            type="button" 
                                            className="remove-image-btn"
                                            onClick={() => handleRemoveOldImage(index)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                        </div>
                    </div>
                    
                    {/* New Images Preview Section */}
                    <div>
                        <label>New Images</label>
                        <div className="update-product-preview-wrapper">
                            {imagesPreview.map((image, index) => (
                                <div key={index} className="image-container">
                                    <img
                                        className="update-product-preview-image"
                                        src={image}
                                        alt="Product Preview"
                                    />
                                    <button 
                                        type="button" 
                                        className="remove-image-btn"
                                        onClick={() => handleRemoveNewImage(index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <button
                        className="update-product-submit-btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Product"}
                    </button>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default UpdateProduct;