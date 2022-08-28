import mongoose, { Schema } from "mongoose";
import usersValidator from "../../validators/user-schema.js";

const usersValidate = new usersValidator();
const usersSchema = mongoose.Schema({
   userId:{ type: Schema.Types.ObjectId,ref:'users'},
   username:String,
   password:String,
   title:String,
   firstName:String,
   lastName:String,
   age:Number,
   dateOfBirth:Date,
   phone:String,
   email:String,
   currentLocation:String,
   profileImage:String,
   gender: {type: String, enum: ["Male", "Female","Others"]},
   address:[{ type: Schema.Types.ObjectId,ref:'UserAddress'}],
   wishlist:[{ type: Schema.Types.ObjectId,ref:'Wishlist'}],
   likedItems:[{ type: Schema.Types.ObjectId,ref:'LikedItems'}]
});
usersSchema.methods.validateSchema = (userObject) => {
   return usersValidate.validateUserSchema(userObject);
}
export default mongoose.model('Users',usersSchema);