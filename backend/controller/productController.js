import Product from "../models/productModel.js";
import HandleError from "../utils/handleError.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import APIFunctionality from "../utils/apiFunctionality.js";
import { uploadToCloudinary, uploadMultipleToCloudinary, deleteFromCloudinary, deleteMultipleFromCloudinary } from "../utils/cloudinaryHelper.js";

// 1️⃣Creating Products
export const createProduct = handleAsyncError(async (req, res, next) => {
    req.body.user = req.user.id;
    
    // Handle image uploads
    let images = [];
    
    if (req.files) {
        // Handle multiple images
        if (req.files.images) {
            const imageFiles = Array.isArray(req.files.images) 
                ? req.files.images 
                : [req.files.images];
            
            try {
                images = await uploadMultipleToCloudinary(imageFiles, 'pumpkin-cosmetics/products');
            } catch (error) {
                return next(new HandleError("Error uploading product images", 500));
            }
        }
    }
    
    // Use uploaded images or default
    req.body.image = images.length > 0 ? images : [{
        public_id: "default_product",
        url: "https://res.cloudinary.com/demo/image/upload/default_product.png"
    }];
    
    const product = await Product.create(req.body);
    
    res.status(201).json({
        success: true,
        product
    });
})

// 2️⃣Get All Products
export const getAllProducts = handleAsyncError(async (req, res, next) => {
    const resultPerPage = 4;
    const apiFeatures = new APIFunctionality(Product.find(), req.query).search().filter();
    // Getting filtered query before pagination
    const filteredQuery = apiFeatures.query.clone();
    const productCount = await filteredQuery.countDocuments();
    // Total Pages calculation
    const totalPages = Math.ceil(productCount / resultPerPage);
    const page = Number(req.query.page) || 1;

    if(page > totalPages && productCount > 0) {
        return next(new HandleError("Page not found", 404))
    }
    apiFeatures.pagination(resultPerPage);
    
    const products = await apiFeatures.query;
    if(!products || products.length === 0) {
        return next(new HandleError("Products not found", 404))
    }
    res.status(200).json({
        success: true,
        products,
        productCount,
        totalPages,
        resultPerPage,
        currentPage: page
    })
})

// 3️⃣Update Product
export const updateProduct = handleAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    
    if (!product) {
        return next(new HandleError("Product not found", 404));
    }
    
    // Handle image deletions if provided
    if (req.body.imagesToDelete) {
        const imagesToDelete = Array.isArray(req.body.imagesToDelete) 
            ? req.body.imagesToDelete 
            : [req.body.imagesToDelete];
        
        // Delete specified images from Cloudinary
        if (imagesToDelete.length > 0) {
            try {
                await deleteMultipleFromCloudinary(imagesToDelete);
            } catch (error) {
                console.log("Error deleting product images:", error.message);
            }
            
            // Remove deleted images from product
            product.image = product.image.filter(img => 
                !imagesToDelete.includes(img.public_id)
            );
        }
    }
    
    // Handle image updates if provided
    if (req.files && req.files.images) {
        // Upload new images
        const imageFiles = Array.isArray(req.files.images) 
            ? req.files.images 
            : [req.files.images];
        
        try {
            const newImages = await uploadMultipleToCloudinary(imageFiles, 'pumpkin-cosmetics/products');
            // Append new images to existing ones
            product.image = [...product.image, ...newImages];
        } catch (error) {
            return next(new HandleError("Error uploading new product images", 500));
        }
    }
    
    // Update other product fields
    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;
    product.stock = req.body.stock || product.stock;
    
    await product.save({ validateBeforeSave: false });
    
    res.status(200).json({
        success: true,
        product
    });
})

// 4️⃣DELETE PRODUCT
export const deleteProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
        return next(new HandleError("Product not found", 404));
    }
    
    // Delete images from Cloudinary
    if (product.image && product.image.length > 0) {
        const publicIds = product.image
            .filter(img => img.public_id && img.public_id !== 'default_product')
            .map(img => img.public_id);
        
        if (publicIds.length > 0) {
            try {
                await deleteMultipleFromCloudinary(publicIds);
            } catch (error) {
                console.log("Error deleting product images:", error.message);
            }
        }
    }
    
    await Product.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully"
    });
})

// 5️⃣GET SINGLE PRODUCT
export const getSingleProduct = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new HandleError("Product not found", 404))
    }
    res.status(200).json({
        success: true,
        product
    })
})

// 6️⃣Creating and Updating Review
export const createReviewForProduct = handleAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user.id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);
    if (!product) {
        return next(new HandleError(`Product with id ${productId} not found`, 404));
    }
    const reviewExists = product.reviews.find(
        review => review.user.toString() === req.user.id.toString());

    if (reviewExists) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user.id.toString()) {
                review.comment = comment;
                review.rating = Number(rating);
            }
        });
    } else {
        product.reviews.push(review);
    }
    product.numberOfReviews = product.reviews.length
    let sum = 0;
    product.reviews.forEach(review => {
        sum += review.rating;
    })
    product.rating = product.reviews.length>0 ? sum / product.reviews.length:0
    await product.save({validateBeforeSave: false});
    res.status(200).json(
        {
            success: true,
            product
        }
    )
})
// 7️⃣Getting product reviews
export const getProductReviews = handleAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    if (!product) {
        return next(new HandleError(`Product with id ${req.query.id} not found`, 404));
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})
// 8️⃣Deleting Review
export const deleteReview = handleAsyncError(async (req, res, next) => {
    const { productId, id } = req.query;

    const product = await Product.findById(productId);
    if (!product) {
        return next(new HandleError(`Product with id ${productId} not found`, 404));
    }

    const reviews = product.reviews.filter(
        review => review._id.toString() !== id.toString()
    );

    if (reviews.length === product.reviews.length) {
        return next(new HandleError(`Review with id ${id} not found`, 404));
    }

    const numberOfReviews = reviews.length;
    const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    const rating = numberOfReviews > 0 ? sum / numberOfReviews : 0;

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { reviews, rating, numberOfReviews },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        message: "Review deleted successfully",
        product: updatedProduct
    });
});
// Admin Getting all products
export const getAdminProducts = handleAsyncError(async (req, res, next) => {
    const resultPerPage = 10; // Default to 10 products per page
    const apiFeatures = new APIFunctionality(Product.find(), req.query).search().filter();
    
    // Getting filtered query before pagination
    const filteredQuery = apiFeatures.query.clone();
    const productCount = await filteredQuery.countDocuments();
    
    // Total Pages calculation
    const totalPages = Math.ceil(productCount / resultPerPage);
    const page = Number(req.query.page) || 1;
    
    if(page > totalPages && productCount > 0) {
        return next(new HandleError("Page not found", 404))
    }
    
    apiFeatures.pagination(resultPerPage);
    
    const products = await apiFeatures.query;
    
    res.status(200).json({
        success: true,
        products,
        productCount,
        totalPages,
        resultPerPage,
        currentPage: page
    })
})