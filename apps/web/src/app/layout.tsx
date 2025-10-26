import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Providers } from "@/app/providers";
import { Navbar } from "@/components/header/navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <main>
            <Navbar />
            {children}
            <Toaster />
          </main>
        </Providers>
      </body>
    </html>
  );
}
