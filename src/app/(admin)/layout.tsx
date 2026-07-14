import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";
import { AdminHeader } from "@/components/admin/layout/admin-header";

export const metadata = {
  title: "Admin | TRENDRUSH X",
  robots: "noindex, nofollow", // Fundamental: Nunca indexar o painel administrativo no Google
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full bg-[#020202] overflow-hidden text-foreground selection:bg-brand-purple/30">
      {/* Sidebar Fixa na Esquerda */}
      <AdminSidebar />
      
      {/* Área Principal */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <AdminHeader />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}