import NextAuth from 'next-auth';
import { getSession } from 'next-auth/react';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoClient } from 'mongodb'; // Import MongoClient from 'mongodb'

import { User } from '@/models/User';
import bcrypt from 'bcrypt';
import { mongooseConnect } from '@/lib/mongoose';



export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          
       

          const user = await fetchUserByEmail(credentials.email);

          // If the user doesn't exist or the password is incorrect, return null
          if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
       
            return null;
          }

         
          return user; // Return the user object if authenticadxted
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
