import mongoose from 'mongoose'
const userSchema=  new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        // unique:true,
    },
    avatar:{
           type:String,
           default:"https://reputationtoday.in/wp-content/uploads/2019/11/110-1102775_download-empty-profile-hd-png-download.jpg"
    },
},{timestamps:true});
const User =mongoose.model('User',userSchema);
export default User;