import { AuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Estende o tipo User do NextAuth para incluir o id
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string | null;
    name?: string | null;
    picture?: string | null;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      console.log(
        "Calling API to sign in with Google",
        `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
      );
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          googleId: user.id,
          name: user.name,
          email: user.email,
          profilePicture: user.image,
        }),
      });

      console.log("Response from API", res);

      if (!res.ok) {
        throw new Error("Failed to sign in with Google");
      }

      return true;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login", // Redireciona erros para a página de login
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
};
