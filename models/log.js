import mongoose, {model, Schema, models} from "mongoose";

const LogSchema = new Schema({

  name: {type:String, required:true},
  email: {type:String, required:true},
  time: {type:String},
  
});


export const Log = models.Log || model('Log', LogSchema);