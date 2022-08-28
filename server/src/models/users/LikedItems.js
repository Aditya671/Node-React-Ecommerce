import mongoose, { Schema } from "mongoose";

const LikedItems  = mongoose.Schema({
    title:String,
    type:{type:String,enum:['Private','Public']},
    items:[{type:Schema.Types.ObjectId,ref:'products'}],
})
export default mongoose.model('LikedItems',LikedItems);