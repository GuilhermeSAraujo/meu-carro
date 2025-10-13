import LoginContent from "@/components/login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - MeuCarro",
  description: "Acesse sua conta no MeuCarro para gerenciar seus veículos",
  keywords: ["login", "autenticação", "acesso", "veículos", "gerenciamento de veículos"],
  openGraph: {
    title: "Login - MeuCarro",
    description: "Acesse sua conta no MeuCarro para gerenciar seus veículos",
    images: [
      {
        url: "/success.svg",
        width: 1200,
        height: 630,
        alt: "MeuCarro - Login",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Login - MeuCarro",
    description: "Acesse sua conta no MeuCarro para gerenciar seus veículos",
    images: ["/success.svg"],
  },
  robots: {
    index: false,
    follow: true,
  },
  //   metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6396ff",
};

export default function Login() {
  return <LoginContent />;
}
