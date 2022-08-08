import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userCredential = mongoose.Schema({
   username: {type:String,unique:true,required:false},
   email: {type:String,trim:true,unique:true,required:false},
   password: {type:String, trim:true,required:true},
   phone:{type:String,trim:true,required:false,unique:false}
});

 
export default mongoose.model('usercredentials',userCredential);