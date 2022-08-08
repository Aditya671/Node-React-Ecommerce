import mongoose from "mongoose";
import usersValidator from "../../validators/user-schema.js";

const usersValidate = new usersValidator();
const usersSchema = mongoose.Schema({
   userId:String,
   username:String,
   password:String,
   age:Number,
   title:String,
   firstName:String,
   lastName:String,
   phone:String,
   email:String,
   currentLocation:String,
   profileImage:String,
   gender:String,
   address:String,
   city:String,
   country:String,
   countryCode:String
});
usersSchema.methods.validateSchema = (userObject) => {
   return usersValidate.validateUserSchema(userObject);
}
export default mongoose.model('Users',usersSchema);