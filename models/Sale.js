import mongoose, {model, Schema, models} from "mongoose";

const SaleSchema = new Schema({
  line_items:Object,
 price: {type: Number, required: true},
 saler: {type: String, required: true}, 
 esawa: {type: String, required: true}, 
  
}, {
  timestamps: true,
});

export const Sale = models.Sale || model('Sale', SaleSchema);