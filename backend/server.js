import dotenv from "dotenv";
// Check if we're running from project root or backend directory
const configPath = process.cwd().endsWith('backend') 
  ? "./config/config.env" 
  : "./backend/config/config.env";

dotenv.config({ path: configPath });

import app from "./app.js";
import { connectMongoDatabase } from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js";

connectMongoDatabase();
connectCloudinary();
// Handling uncaught exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to uncaught exception");
    process.exit(1);
})
const port = process.env.PORT || 3000;

const server = app.listen(port , () => {
  console.log(`Server is listening on port ${port}`);
});
process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log("Shutting down the server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
})