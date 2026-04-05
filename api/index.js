import express from 'express';
import mongoose  from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from '../server/routes/user.route.js';
import authRouter from '../server/routes/auth.route.js';
import listingRouter from '../server/routes/listing.route.js';
import uploadRouter from '../server/routes/upload.route.js';
import cookieParser from 'cookie-parser';
dotenv.config();

mongoose
.connect(process.env.MONGO, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(()=>{
    console.log("connected the mongodb");
})
.catch((err)=>{
    console.log(err);
});

const app=express();
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/user/',userRouter);
app.use('/api/auth/',authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/upload', uploadRouter);

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||'internal server error';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    });
});

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
});

export default app;
