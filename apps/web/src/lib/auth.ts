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
    email?: string;
    name?: string;
    picture?: string;
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
    async redirect({ url, baseUrl }) {
      // Permite redirecionamento para URLs relativas ou do mesmo domínio
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Permite callback URLs do mesmo domínio
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, user, account }) {
      // Adiciona informações do usuário ao token na primeira vez
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      // Adiciona informações do token à sessão
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          image: token.picture as string,
        };
      }
      return session;
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
