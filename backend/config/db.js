import mongoose from "mongoose";

export const connectMongoDatabase = () => {
    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is not defined in environment variables");
        process.exit(1);
    }
    
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then((data) => {
        console.log(`Mongodb connected with server: ${data.connection.host}`);
    }).catch((err) => {
        console.error("Error connecting to MongoDB:", err.message);
        process.exit(1);
    });
}

export default connectMongoDatabase;