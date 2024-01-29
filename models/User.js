import mongoose, {model, Schema, models} from "mongoose";

const UserSchema = new Schema({

  name: {type:String, required:true},
  email: {type:String, required:true},
  image: {type:String},
  emailVerified: {type:String},
  role:{type:String, required:true},
  password: {type:String},
  passhint: {type:String},
});


export const User = models.User || model('User', UserSchema);