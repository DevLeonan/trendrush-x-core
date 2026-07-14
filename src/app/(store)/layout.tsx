import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      
      {/* O main ocupa o espaço restante, empurrando o footer para o final */}
      <main className="flex-1 w-full relative">
        {children}
      </main>

      <Footer />
    </div>
  );
}