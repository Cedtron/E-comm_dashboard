import NextAuth from 'next-auth';

import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from '@/models/User';
import bcrypt from 'bcrypt';
import { mongooseConnect } from '@/lib/mongoose';
import { MongoClient } from 'mongodb'; // Import MongoClient from 'mongodb'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';



export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
       
        try {
          await mongooseConnect();
          const user = await User.findOne({ email });

          if (!user) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);
//  console.log('User:', email);
//         console.log('Passwords match:', passwordsMatch);
          if (!passwordsMatch) {
            return null;
          }

          return user;
        } catch (error) {
          console.log('Error: ', error);
        }
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    // async session({ session, user }) {
    //   if (user) {
    //   session.user = {
    //     email: user.email,
    //     role: user.role,
    //   };
    //   }
    //   return session;
    // },
    // async session({ session, token, user }) {
    //   session.accessToken = token.accessToken;
    //   session.user = {
    //     email: user.email,
    //     role: user.role,
    //   };
    //   return session;
    // },
    async jwt({token,user,session}){
console.log("jwt callback",{token,user,session})
return token;
    },
  
    async session({ session, token,user }) {
      // session.accessToken = token.accessToken;
      console.log("session callback",{ session, token,user })
      return session
    },


  },
  session:{strategy:"jwt",}
  ,

};

export default NextAuth(authOptions);
export async function isAdminRequest(req,res) {
  const session = await getServerSession(req,res,authOptions);
  if ((session?.user?.email)) {
    res.status(401);
    res.end();
    throw 'not an admin';
  }
}

