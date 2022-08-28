import mongoose from "mongoose";

const addressSchema = mongoose.Schema({
    userId:{ type: Schema.Types.ObjectId,ref:'users'},
    title:String,
    firstName:String,
    lastName:String,
    phone:String,
    addressLine1:String,
    addressLine2:String,
    addressLine3:String,
    city:String,
    landmark:String,
    state:String,
    country:String,
    countryCode:String,
    pincode:String,
    default:Boolean,
    addressType:{type:String,enum:['Home','Office','Others']}
});
export default mongoose.model('UserAddress',addressSchema);