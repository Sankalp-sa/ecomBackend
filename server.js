import express from "express";
import dotevn from "dotenv";
import morgan from "morgan";
import cors from "cors";

import connectDB from './config/db.js';
import authRoute from './routes/authRoute.js';
import categoryRoute from './routes/categoryRoute.js';
import productRoute from './routes/productRoute.js';

// set cors to *

//config dotevn
dotevn.config();

//connect to database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server running on ${process.env.DEV_MODE} mode on port ${port}`));
