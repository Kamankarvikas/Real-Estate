import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import {errorHandler} from '../utils/error.js';
import jwt from 'jsonwebtoken';
import getTransporter from '../config/nodemailer.js';
import { verificationEmailTemplate, welcomeEmailTemplate } from '../utils/emailTemplates.js';

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

export const signup = async (req,res,next)=>{
  const {username,email,password}=req.body;
  const hashpassword=bcryptjs.hashSync(password,10);
  const newUser=new  User ({username,email,password:hashpassword, isVerified: false});
  try{
    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return next(errorHandler(400, 'This email is already registered. Please use a different email or sign in.'));
      }
      if (existingUser.username === username) {
        return next(errorHandler(400, 'This username is already taken. Please choose a different one.'));
      }
    }

    await newUser.save();

    // Send verification email
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    const verifyLink = `${CLIENT_URL}/activate-account?token=${token}`;

    await getTransporter().sendMail({
      from: `"Kamankar Estate" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your email - Kamankar Estate',
      html: verificationEmailTemplate(username, verifyLink),
    });

    res.status(201).json({ success: true, message: 'Account created successfully! Please check your email to verify your account.' });
  }catch(error){
     next(error);
  }

};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) return next(errorHandler(400, 'Verification token is required'));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return next(errorHandler(404, 'User not found'));
    if (user.isVerified) return res.status(200).json({ success: true, message: 'Account is already verified', alreadyVerified: true });

    user.isVerified = true;
    await user.save();

    // Send welcome email after verification
    await getTransporter().sendMail({
      from: `"Kamankar Estate" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Welcome to Kamankar Estate!',
      html: welcomeEmailTemplate(user.username),
    });

    res.status(200).json({ success: true, message: 'Account verified successfully!' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(errorHandler(400, 'Verification link has expired. Please request a new one.'));
    }
    next(error);
  }
};

export const resendVerification = async (req, res, next) => {
  console.log("process.env.EMAIL_USER",process.env.EMAIL_USER)
  try {
    const { email } = req.body;
    if (!email) return next(errorHandler(400, 'Email is required'));

    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, 'User not found'));
    if (user.isVerified) return next(errorHandler(400, 'Account is already verified'));

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    const verifyLink = `${CLIENT_URL}/activate-account?token=${token}`;

    await getTransporter().sendMail({
      from: `"Kamankar Estate" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your email - Kamankar Estate',
      html: verificationEmailTemplate(user.username, verifyLink),
    });

    res.status(200).json({ success: true, message: 'Verification email sent! Please check your inbox.' });
  } catch (error) {
    next(error);
  }
};

export const Signin=async (req,res,next)=>{
  const {email,password}=req.body;
  try{
    const validUser=await User.findOne({email});
    if(!validUser) return next(errorHandler(404,'wrong email !! Plzz provide a valid email'));
    const validpassword = bcryptjs.compareSync(password,validUser.password);
    if(!validpassword) return next(errorHandler(404,'Wrong password!'));

    if (!validUser.isVerified) {
      return next(errorHandler(403, 'Please verify your email before signing in. Check your email inbox for the verification link.'));
    }

    const token = jwt.sign({id: validUser._id},process.env.JWT_SECRET);
    const { password:pass,...rest}=validUser._doc;
    res.cookie('access_token',token,{ httpOnly: true, secure: true, sameSite: 'none' }).status(200).json({ ...rest, access_token: token });
  }catch(error)
  {
    next(error);
  }
}

export const Google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true, secure: true, sameSite: 'none' })
        .status(200)
        .json({ ...rest, access_token: token });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
        isVerified: true,
      });
      await newUser.save();

      // Send welcome email for Google users
      try {
        await getTransporter().sendMail({
          from: `"Kamankar Estate" <${process.env.EMAIL_USER}>`,
          to: req.body.email,
          subject: 'Welcome to Kamankar Estate!',
          html: welcomeEmailTemplate(req.body.name),
        });
      } catch (emailErr) {
        console.log('Welcome email failed:', emailErr.message);
      }

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true, secure: true, sameSite: 'none' })
        .status(200)
        .json({ ...rest, access_token: token });
    }
  } catch (error) {
    next(error);
  }
};
export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token', { httpOnly: true, secure: true, sameSite: 'none' });
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};
