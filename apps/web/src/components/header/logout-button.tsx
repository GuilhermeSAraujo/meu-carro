"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  return (
    <Button className="cursor-pointer" onClick={handleLogout} variant="ghost" size="sm">
      <LogOut className="size-4" />
      Sair
    </Button>
  );
}
