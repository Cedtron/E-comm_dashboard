import mongoose from 'mongoose';
import { createShopy } from './mongocon';

export async function mongooseConnect() {
  try {
    // Call createShopy to ensure the database and required data are set up
    // await createShopy();

    // Check if the mongoose connection is already established
    if (mongoose.connection.readyState === 1) {
      console.log('Mongoose connection already established.');
      return mongoose.connection.asPromise();
    } else {
      const uri = process.env.MONGODB_URI;
      console.log('Connecting to MongoDB...');
      return mongoose.connect(uri);
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}