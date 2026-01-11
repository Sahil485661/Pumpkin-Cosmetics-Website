import express from "express";
import product from './route/productRoute.js';
import user from './route/userRoutes.js';
import errorHandleMiddleware from "./middleware/error.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import order from "./route/orderRoutes.js";
import dashboard from "./route/dashboardRoute.js";
import fileUpload from "express-fileupload";
import dot from 'dotenv';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Server static files
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get(/.*/, (_, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
})
app.use(errorHandleMiddleware);
if(process.env.NODE_ENV !== 'PRODUCTION') {
    dot.config({
        path: './config/config.env'
    });
}
export default app;