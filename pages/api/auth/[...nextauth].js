import NextAuth from 'next-auth';

import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from '@/models/User';
import { Log } from '@/models/log';
import bcrypt from 'bcrypt';
import { mongooseConnect } from '@/lib/mongoose';
import { MongoClient } from 'mongodb'; // Import MongoClient from 'mongodb'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';



export const authOptions = {
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET,
    // }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { email: inputEmail, password } = credentials; // Rename the variable here

          await mongooseConnect();
          const user = await User.findOne({ email: inputEmail }); // Use the renamed variable

          if (!user) {
            console.log('User not found');
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
            console.log('Passwords do not match');
            return null;
          }

          const { name, email } = user;
          console.log(`Hello ${name}, email: ${email}`);

          const currentTime = new Date();

          await Log.create({
            name,
            email,
            esawa: currentTime,
          });

          const roles = user.roles;
          const userData = {
            user,
            roles,
          };

          console.log('Authentication successful');
          return userData;

        } catch (error) {
          console.error('Error during authentication:', error);
          return null;
        }
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.user._id; 
        token.name = user.user.name; 
        token.email = user.user.email; 
        token.roles = user.user.role; 
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id, 
        name: token.name, 
        email: token.email, 
        roles: token.roles, 
      };


      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);
export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (session?.user?.roles) {
    const roles = session.user.roles;

    if (roles.includes('admin')) {
      // Allow access for admin roles
      return;
    }
  }

  // Deny access for all other cases
  res.status(401);
  res.end();
  throw 'Not an admin';
}

