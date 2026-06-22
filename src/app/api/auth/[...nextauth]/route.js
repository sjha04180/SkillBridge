import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password');
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email.toLowerCase() });

        if (!user) {
          throw new Error('No user found with this email');
        }

        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordMatch) {
          throw new Error('Incorrect password');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          college: user.college,
          branch: user.branch,
          graduationYear: user.graduationYear,
          role: user.role || 'student',
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          await dbConnect();
          const email = user.email?.toLowerCase();
          if (!email) {
            return false;
          }

          let dbUser = await User.findOne({ email });

          if (!dbUser) {
            // Seed a secure random password hash for mongoose verification compatibility
            const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            dbUser = await User.create({
              name: user.name || email.split('@')[0],
              email,
              password: hashedPassword,
              college: 'Not Provided',
              branch: 'Not Provided',
              graduationYear: new Date().getFullYear(),
              role: 'student',
            });
          }

          // Attach user properties so jwt callback can read them
          user.id = dbUser._id.toString();
          user.college = dbUser.college;
          user.branch = dbUser.branch;
          user.graduationYear = dbUser.graduationYear;
          user.role = dbUser.role || 'student';
        } catch (error) {
          console.error('Error in OAuth signIn callback:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.college = user.college;
        token.branch = user.branch;
        token.graduationYear = user.graduationYear;
        token.role = user.role || 'student';
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.college = token.college;
        session.user.branch = token.branch;
        session.user.graduationYear = token.graduationYear;
        session.user.role = token.role || 'student';
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
