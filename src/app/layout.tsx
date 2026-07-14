import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Otimização de fonte nativa do Next.js (Zero Cumulative Layout Shift)
// Otimização de fonte nativa do Next.js (Zero Cumulative Layout Shift)
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#040404",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Previne zoom indesejado no mobile ao focar em inputs
};

export const metadata: Metadata = {
  title: {
    template: "%s | TRENDRUSH X",
    default: "TRENDRUSH X - Produtos Virais Exclusivos",
  },
  description: "A melhor loja de produtos virais. Tendências mundiais com envio expresso, compra segura e garantia total.",
  metadataBase: new URL("https://trendrushx.com"), // Substituir pelo domínio real em produção
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "TRENDRUSH X",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-background text-foreground flex flex-col font-sans overflow-x-hidden selection:bg-brand-purple selection:text-white">
        {/* Futuramente injetaremos Providers Globais aqui (Zustand, Toaster, Analytics) */}
        {children}
      </body>
    </html>
  );
}