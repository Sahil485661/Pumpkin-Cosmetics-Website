import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Product Name"],
        trim: true
    },
    image: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
    }
],
    price: {
        type: Number,
        required: [true, "Please Enter Product Price"],
        MaxLength: [8, "Price cannot exceed 8 characters"]
    },
    rating:{
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: [ true, "Please Enter Product Category"]
    },
    stock:{
        type: Number,
        required: [true, "Please Enter Product Stock"],
        MaxLength: [5, "Stock cannot exceed 5 characters"],
        default: 1
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    description: {
        type: String,
        required: [true, "Please Enter Product Description"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("Product", productSchema);