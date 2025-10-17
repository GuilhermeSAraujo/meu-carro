import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

type UnauthenticatedUser = {
  isAuthenticated: false;
  name?: undefined;
  email?: undefined;
  image?: undefined;
  fullName?: undefined;
};

type AuthenticatedUser = {
  isAuthenticated: true;
  name: string;
  email: string | null | undefined;
  image: string | null | undefined;
  fullName: string | null | undefined;
};

export async function useUserServer(): Promise<UnauthenticatedUser | AuthenticatedUser> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return {
      isAuthenticated: false,
    };
  }

  const user = session.user;

  return {
    email: user.email,
    image: user.image,
    fullName: user.name,
    name: user.name?.split(" ")[0] ?? "Usuário",
    isAuthenticated: true,
  };
}
