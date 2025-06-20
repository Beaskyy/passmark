import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Extend the session type
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    user?: any;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      // Only on initial sign in with Google
      if (account?.provider === "google" && account.id_token) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/account/social-auth/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: account.id_token }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          token.accessToken = data.access; // or whatever your backend returns
          token.user = data.user;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      session.accessToken = token.accessToken;
      if (token.user) session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
