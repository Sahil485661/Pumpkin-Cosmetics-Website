import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../AdminStyles/CreateProduct.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';

const CreateProduct = () => {
    const navigate = useNavigate();
    
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const categories = [
        "Makeup", "Skincare", "Haircare", "Fragrance", "Nails", "Tools", "Bath & Body", "Gift Sets"
    ];
    
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
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
    
    const handleRemoveImage = (index) => {
        const updatedImages = [...images];
        const updatedPreview = [...imagesPreview];
        updatedImages.splice(index, 1);
        updatedPreview.splice(index, 1);
        setImages(updatedImages);
        setImagesPreview(updatedPreview);
    };
    
    const handleCreateProduct = async (e) => {
        e.preventDefault();
        
        if (images.length === 0) {
            toast.error('Please select at least one image');
            return;
        }
        
        try {
            setLoading(true);
            
            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price);
            formData.append('description', description);
            formData.append('category', category);
            formData.append('stock', stock);
            
            images.forEach((image) => {
                formData.append('images', image);
            });
            
            const response = await axios.post('/api/v1/admin/product/create', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if (response.data.success) {
                toast.success('Product created successfully');
                navigate('/admin/products');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating product');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <>
            <PageTitle title="Create Product" />
            <Navbar />
            <div className="create-product-container">
                <h2 className="form-title">Create New Product</h2>
                
                <form 
                    className="product-form" 
                    encType="multipart/form-data"
                    onSubmit={handleCreateProduct}
                >
                    <input
                        className="form-input"
                        type="text"
                        placeholder="Product Name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    
                    <input
                        className="form-input"
                        type="number"
                        placeholder="Price"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    
                    <textarea
                        className="form-input"
                        placeholder="Product Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                    ></textarea>
                    
                    <input
                    type='text'
                        className="form-select"
                        value={category}
                        required
                        list="categories"
                        placeholder='Enter Category'
                        onChange={(e) => setCategory(e.target.value)}
                    />
                        {/* <option value="">Choose Category</option>
                        {categories.map((cate) => (
                            <option key={cate} value={cate}>
                                {cate}
                            </option>
                        ))} */}
                    
                    
                    <input
                        className="form-input"
                        type="number"
                        placeholder="Stock"
                        required
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                    />
                    
                    <div className="file-input-container">
                        <input
                            className="form-input-file"
                            type="file"
                            name="images"
                            accept="image/*"
                            onChange={handleImageChange}
                            multiple
                        />
                        
                        <div className="image-preview-container">
                            {imagesPreview.map((image, index) => (
                                <div key={index} className="image-preview-wrapper">
                                    <img
                                        className="image-preview"
                                        src={image}
                                        alt="Product Preview"
                                    />
                                    <button 
                                        type="button"
                                        className="remove-image-btn"
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <button
                        className="submit-btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Product"}
                    </button>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default CreateProduct;