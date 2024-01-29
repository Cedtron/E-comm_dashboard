import {model, models, Schema} from "mongoose";

const ExpendSchema = new Schema({

      category: String,
      amount: Number,
      date: Date,
      description: String
}, {
  timestamps: true,
});

export const Expend = models?.Expend || model('Expend', ExpendSchema);