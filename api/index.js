import express from 'express';
import mongoose  from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import uploadRouter from './routes/upload.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
dotenv.config();

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO);
    isConnected = true;
    console.log("connected the mongodb");
  } catch (err) {
    console.log(err);
  }
};

const __dirname=path.resolve();
const app=express();
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Connect to DB on each request (cached via isConnected flag)
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use('/api/user/',userRouter);
app.use('/api/auth/',authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/upload', uploadRouter);

app.use(express.static(path.join(__dirname,'/client/dist')));
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'client','dist','index.html'));
})
app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||'internal server error';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    });
});

// Only listen in development (not on Vercel serverless)
if (process.env.NODE_ENV !== 'production') {
  const PORT=process.env.PORT||3000;
  app.listen(PORT,()=>{
      console.log(`server is running on port ${PORT}`);
  });
}

export default app;
