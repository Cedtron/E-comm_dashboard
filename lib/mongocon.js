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

    // Check if the 'shopy' database exists
    const adminDb = client.db('admin');
    const shopyDbList = await adminDb.admin().listDatabases();

    const shopyDbExists = shopyDbList.databases.some(db => db.name === 'shopy');

    if (shopyDbExists) {
      console.log('Database "shopy" exists.');
    } else {
      console.log('Database "shopy" does not exist. Creating...');

      // Create 'shopy' database
      await adminDb.admin().command({ create: 'shopy' });
      console.log('Database "shopy" created.');
    }

    // Check if the 'shopy' collection already exists
    const shopyCollection = adminDb.collection('shopy');
    const shopyCount = await shopyCollection.countDocuments();

    if (shopyCount > 0) {
      console.log('Exist!!!');
    } else {
      console.log('Not Exist!!!');

      // Check if the user with the given email already exists
      const existingUser = await User.findOne({ email: 'allan@gmail.com' });

      if (existingUser) {
        console.log('User with email already exists. Not creating a new user.');
      } else {
        // Create a new user if the user with the given email doesn't exist
        const newUser = new User({
          name: 'Allan',
          email: 'allan@gmail.com',
          role: 'admin',
          password: '$2b$10$lVggddL8Q2VZc8DGqIAgCOuiENJzWz9nLl2yqjSutAmd3MVUtZWa2'
        });

        // Save the new user to the database
        await newUser.save();

        console.log('User created successfully.');
      }
    }

  } catch (error) {
    console.error('Error creating MongoDB Atlas Cluster and adding user:', error);
  }
}