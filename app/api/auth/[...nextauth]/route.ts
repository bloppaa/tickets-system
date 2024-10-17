import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        if (!credentials) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) throw new Error("USER_NOT_FOUND");

        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordsMatch) throw new Error("WRONG_PASSWORD");

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
