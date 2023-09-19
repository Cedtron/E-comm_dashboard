import NextAuth from 'next-auth';
import { getSession } from 'next-auth/react';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoClient } from 'mongodb'; // Import MongoClient from 'mongodb'

import { User } from '@/models/User';
import bcrypt from 'bcrypt';

async function fetchUserByEmail(email) {
  return await User.findOne({ email });
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        try {
          // Establish the MongoDB connection
          const client = new MongoClient(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
          await client.connect();

          const user = await fetchUserByEmail(credentials.username);

          // If the user doesn't exist or the password is incorrect, return null
          if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
            client.close(); // Close the MongoDB connection
            return null;
          }

          client.close(); // Close the MongoDB connection
          return user; // Return the user object if authenticated
        } catch (error) {
          console.error('Error fetching user:', error);
          return null; // Handle the error gracefully
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (user) {
        session.user.role = user.role;
        return session;
      }
      return null;
    },
  },
});
