import mongoose, { Schema } from "mongoose";

const Wishlist  = mongoose.Schema({
    title:String,
    type:{type:String,enum:['Private','Public']},
    items:[{type:Schema.Types.ObjectId,ref:'products'}],
    members:[{type:Schema.Types.ObjectId,ref:'users'}]
})
export default mongoose.model('Wishlist',Wishlist);