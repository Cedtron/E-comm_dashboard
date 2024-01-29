import mongoose, {model, Schema, models} from "mongoose";

const ProductSchema = new Schema({
  title: {type:String, required:true},
  description: String,
brand: {type:String, required:true}, 
  price: {type: Number, required: true},
  costprice: {type: Number, required: true},
  color: {type:String, required:true},
  expdate: {type:String, required:true},
  stock: {type: Number, required: true},
  rating: {type: Number},
  images: [{type:String}],
  category: {type:mongoose.Types.ObjectId, ref:'Category'},
  properties: {type:Object},
}, {
  timestamps: true,
});

export const Product = models.Product || model('Product', ProductSchema);