import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function useUserServer() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      isAuthenticated: false,
    };
  }

  const user = session?.user;

  return {
    ...user,
    fullName: user.name,
    name: user.name.split(" ")[0],
    isAuthenticated: !!user,
  };
}
