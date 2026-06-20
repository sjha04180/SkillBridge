import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      college: string;
      branch: string;
      graduationYear: number;
    } & DefaultSession["user"]
  }

  interface User {
    id: string;
    college: string;
    branch: string;
    graduationYear: number;
  }
}
