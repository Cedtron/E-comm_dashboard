import { model, Schema } from 'mongoose';
import mongoose from 'mongoose';
import clientPromise from './mongodb';
import { User } from "@/models/User";

// Check if the SetupFlag model is already defined
const setupFlagModelName = 'SetupFlag';
const existingSetupFlagModel = mongoose.modelNames().includes(setupFlagModelName);

const SetupFlag = existingSetupFlagModel
  ? mongoose.model(setupFlagModelName)
  : model(setupFlagModelName, new Schema({ setupComplete: Boolean }));

export async function createShopy() {
  try {
    // Connect to MongoDB Atlas
    const client = await clientPromise;

    // Check if the cluster already exists
    const adminDb = client.db('admin');
    const databases = await adminDb.listCollections().toArray();

    if (databases.some(db => db.name === 'shopy')) {
      console.log('MongoDB Atlas Cluster "shopy" already exists.');

      // Check if setup has been completed
      const setupFlag = await SetupFlag.findOne();
      if (setupFlag && setupFlag.setupComplete) {
        console.log('Database setup has already been completed. Skipping user creation...');
        return;
      }
    } else {
      // Create the cluster (this step requires setting up the cluster on MongoDB Atlas)
      console.log('Creating MongoDB Atlas Cluster "shopy"...');
      // Additional configuration and steps needed to create a cluster go here
    }

    // Check if the User model already exists
    const userModel = mongoose.model('User');
    if (userModel) {
      console.log('User model already exists.');

      // Check if any users exist
      const existingUsers = await userModel.find();
      if (existingUsers.length > 0) {
        console.log('Users already exist. Skipping user creation...');
        return;
      }
    } else {
      // Define the User model if it doesn't exist
      console.log('Defining User model...');
      // Additional configuration for the User model goes here
    }

    // Add a new user to the database
    const newUser = new User({
      name: 'Allan',
      email: 'allan@gmail.com',
      role: 'admin',
      password: '$2b$10$lVggddL8Q2VZc8DGqIAgCOuiENJzWz9nLl2yqjSutAmd3MVUtZWa2'
    });

    await newUser.save();
    console.log('User added successfully.');

    // Update the setup flag to indicate completion
    await SetupFlag.updateOne({}, { setupComplete: true }, { upsert: true });

  } catch (error) {
    console.error('Error creating MongoDB Atlas Cluster and adding user:', error);
  }
}