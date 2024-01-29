import mongoose, {model, models, Schema} from "mongoose";

const CatexpendSchema = new Schema({
  name: {type:String,required:true},

  properties: [{type:Object}]
});

export const Catexpend = models?.Catexpend || model('Catexpend', CatexpendSchema);