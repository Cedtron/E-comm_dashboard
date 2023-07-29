import mongoose, {model, Schema, models} from "mongoose";

const SaleSchema = new Schema({
  productId: {type:mongoose.Types.ObjectId, ref:'Product'},
  product: {type:String, required:true},
 stock: {type: Number, required: true}, 
 price: {type: Number, required: true},
 saler: {type: String, required: true}, 
 esawa: {type: String, required: true}, 

  
}, {
  timestamps: true,
});

export const Sale = models.Sale || model('Sale', SaleSchema);