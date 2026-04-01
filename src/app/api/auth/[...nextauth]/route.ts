import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      // Increase http timeout for the underlying openid-client discovery/request
      // (default can be short in some environments). Value is in milliseconds.
      client: {
        httpOptions: { timeout: 10000 },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || undefined,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // pass minimal profile information to the client
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.user = {
          name: (profile as any)?.name || token.name,
          email: token.email,
          picture: token.picture,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session as any).user = token.user || session.user;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions as any);

export { handler as GET, handler as POST };
