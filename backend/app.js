import express from "express";
import product from './route/productRoute.js';
import user from './route/userRoutes.js';
import errorHandleMiddleware from "./middleware/error.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import order from "./route/orderRoutes.js";
import dashboard from "./route/dashboardRoute.js";
import fileUpload from "express-fileupload";
const app = express();


// Middleware
app.use(express.json());
app.use(cookieParser());
// Enable CORS to allow requests from frontend
const clientOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
    origin: clientOrigin,
    credentials: true
}));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
// Routes

app.use('/api/v1', product);
app.use('/api/v1', user);
app.use("/api/v1", order);
app.use("/api/v1", dashboard);
app.use(errorHandleMiddleware);
export default app;