import handleAsyncError from "../middleware/handleAsyncError.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

// Get dashboard statistics
export const getDashboardStats = handleAsyncError(async (req, res, next) => {
    // Fetch all data in parallel for better performance
    const [products, orders, users] = await Promise.all([
        Product.find(),
        Order.find().populate('user', 'name'),
        User.find()
    ]);
    
    // Calculate products statistics
    const totalProducts = products.length;
    const outOfStockProducts = products.filter(product => product.stock === 0).length;
    
    // Calculate orders statistics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    
    // Order status distribution
    const orderStatus = {
        processing: orders.filter(order => order.orderStatus === 'Processing').length,
        shipped: orders.filter(order => order.orderStatus === 'Shipped').length,
        delivered: orders.filter(order => order.orderStatus === 'Delivered').length,
        cancelled: orders.filter(order => order.orderStatus === 'Cancelled').length
    };
    
    // Recent orders (last 5)
    const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(order => ({
            _id: order._id,
            user: order.user,
            totalPrice: order.totalPrice,
            orderStatus: order.orderStatus,
            createdAt: order.createdAt
        }));
    
    // Calculate top selling products
    const productSales = {};
    orders.forEach(order => {
        order.orderItems.forEach(item => {
            if (productSales[item.product]) {
                productSales[item.product] += item.quantity;
            } else {
                productSales[item.product] = item.quantity;
            }
        });
    });
    
    // Convert to array and sort by sales quantity
    const topProducts = Object.entries(productSales)
        .map(([productId, quantity]) => ({ productId, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);
    
    // Get product details for top products
    const topProductDetails = topProducts.map(item => {
        const product = products.find(p => p._id.toString() === item.productId);
        return {
            ...item,
            name: product ? product.name : 'Unknown Product',
            image: product && product.image.length > 0 ? product.image[0].url : ''
        };
    });
    
    res.status(200).json({
        success: true,
        data: {
            products: {
                total: totalProducts,
                outOfStock: outOfStockProducts
            },
            orders: {
                total: totalOrders,
                revenue: totalRevenue,
                status: orderStatus
            },
            users: {
                total: users.length
            },
            recentOrders,
            topProducts: topProductDetails
        }
    });
});