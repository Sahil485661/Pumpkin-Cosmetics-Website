import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import HandleError from "../utils/handleError.js";
import User from "../models/userModel.js";

// Create New Order
export const createNewOrder = handleAsyncError(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    })
    res.status(201).json({
        success: true,
        order
    })
})
// Get Single Order by admin
export const getSingleOrder = handleAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
        return next(new HandleError(`Order with id ${req.params.id} not found`, 404));
    }
    // Allow access to admins or the user who placed the order
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
        return next(new HandleError(`Role - ${req.user.role} is not allowed to access this resource`, 403));
    }
    res.status(200).json({
        success: true,
        order
    })
})
// All my Orders by user
export const allMyOrders = handleAsyncError(async (req, res, next) => {
    const order = await Order.find({ user: req.user._id });
    if (!order) {
        return next(new HandleError(`Order with id ${req.params.id} not found`, 404));
    }
    res.status(200).json({
        success: true,
        order
    })
})
// Admin get all orders
export const getAllOrders = handleAsyncError(async (req, res, next) => {
    const orders = await Order.find().populate("user", "name email");
    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice
    })
    res.status(200).json({
        success: true,
        orders,
        totalAmount
    })
})
// Update order status
export const updateOrderStatus = handleAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new HandleError(`Order with id ${req.params.id} not found`, 404));
    }
    if (order.orderStatus === "Delivered") {
        return next(new HandleError("You have already delivered this order", 400))
    }
    // Only update stock when order is being marked as delivered
    if (req.body.status === "Delivered") {
        await Promise.all(
            order.orderItems.map(item => updateQuantity(item.product, item.quantity))
        );
    }
    order.orderStatus = req.body.status;
    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }
    await order.save({validateBeforeSave: false});
    res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        order
    })
})
async function updateQuantity(id, quantity) {
    const product = await Product.findById(id);
    if (!product) {
        console.warn(`Product with id ${id} not found - skipping stock update`);
        return; // Skip update if product doesn't exist
    }
    product.stock -= quantity;
    await product.save({validateBeforeSave: false});
}
// Delete Order
export const deleteOrder = handleAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new HandleError(`Order with id ${req.params.id} not found`, 404));
    }
    if(order.orderStatus !== "Delivered") {
        return next(new HandleError("This order is under processing and can't be deleted", 400))
    }
    await Order.deleteOne({ _id: req.params.id });
    res.status(200).json({
        success: true,
        message: "Order deleted successfully"
    })
})