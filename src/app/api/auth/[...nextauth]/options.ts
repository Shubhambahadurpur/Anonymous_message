/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text ", placeholder: "username" },
        password: { label: "Password", type: "password", placeholder: "Password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [{ email: credentials.identifier }, { username: credentials.identifier }],
          });
          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user?.isVerified) {
            throw new Error("Please verify your account first.");
          }
          const isPassword = await bcrypt.compare(credentials.password, user?.password);
          if (isPassword) {
            return user;
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user}) {
      if(user) {
        token._id = user._id?.toString()
        token.isVerified = user.isVerified
        token.isAcceptingMessages = user.isAcceptingMessages
        token.username = user.username
      }
      return token
    },
    async session({ session, token}) {
      if(token) {
        session.user._id = token._id?.toString()
        session.user.isVerified = token?.isVerified
        session.user.isAcceptingMessages = token?.isAcceptingMessages
        session.user.username = token?.username
      }
      return session
    }
  },
  pages: {
    signIn: '/sign-in'
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET
};
