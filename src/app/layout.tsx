import { Header } from "@/components/shared/Header";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Provider as QueryProvider } from "@/components/shared/QueryProvider";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LoreHub - Hub de Investigações e Lore",
  description: "Sua plataforma central para discutir, validar e conectar teorias de jogos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "dark", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col bg-black selection:bg-primary/20 selection:text-primary">
        <QueryProvider>
          <Header />
          <div className="flex-1 flex flex-col pt-4">
            {children}
          </div>
          <Toaster richColors position="top-center" />
        </QueryProvider>
      </body>
    </html>
  );
}

