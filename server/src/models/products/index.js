import mongoose from "mongoose";


const productsSchema = mongoose.Schema({
   productId:Number,
   name:String,
   categories:String,
   price:Number,
   in_stock:Number,
   description:String,
   current_qty:Number,
   is_new:Boolean,
   image_url:String,
});

export default mongoose.model('products',productsSchema);