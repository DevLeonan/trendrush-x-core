import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw, CreditCard } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#080808] border-t border-border mt-auto">
      {/* Trust Badges Section */}
      <div className="border-b border-border/50 bg-card/20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start gap-2">
              <ShieldCheck className="h-8 w-8 text-brand-green" />
              <h4 className="text-white font-semibold">Compra 100% Segura</h4>
              <p className="text-xs text-muted">Seus dados são criptografados de ponta a ponta.</p>
            </div>
            <div className="flex flex-col items-center md:items-start gap-2">
              <Truck className="h-8 w-8 text-brand-blue" />
              <h4 className="text-white font-semibold">Frete Expresso</h4>
              <p className="text-xs text-muted">Envio rápido com rastreamento em tempo real.</p>
            </div>
            <div className="flex flex-col items-center md:items-start gap-2">
              <RotateCcw className="h-8 w-8 text-brand-purple" />
              <h4 className="text-white font-semibold">Garantia de 7 Dias</h4>
              <p className="text-xs text-muted">Devolução facilitada caso não goste do produto.</p>
            </div>
            <div className="flex flex-col items-center md:items-start gap-2">
              <CreditCard className="h-8 w-8 text-brand-red" />
              <h4 className="text-white font-semibold">Parcelamento Facilitado</h4>
              <p className="text-xs text-muted">Pague em até 12x no cartão ou via PIX com desconto.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-black tracking-tighter text-white">
              TREND<span className="text-gradient">RUSH</span> X
            </h3>
            <p className="text-sm text-muted max-w-xs">
              A plataforma definitiva para encontrar os produtos virais mais cobiçados da internet antes de todo mundo.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Departamentos</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/categoria/tecnologia" className="hover:text-brand-blue transition-colors">Tecnologia & Gadgets</Link></li>
              <li><Link href="/categoria/casa" className="hover:text-brand-blue transition-colors">Casa Inteligente</Link></li>
              <li><Link href="/categoria/saude" className="hover:text-brand-blue transition-colors">Saúde & Beleza</Link></li>
              <li><Link href="/categoria/automotivo" className="hover:text-brand-blue transition-colors">Automotivo</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/rastreio" className="hover:text-brand-blue transition-colors">Rastrear Pedido</Link></li>
              <li><Link href="/faq" className="hover:text-brand-blue transition-colors">Perguntas Frequentes</Link></li>
              <li><Link href="/trocas" className="hover:text-brand-blue transition-colors">Trocas e Devoluções</Link></li>
              <li><Link href="/contato" className="hover:text-brand-blue transition-colors">Fale Conosco</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/termos" className="hover:text-brand-blue transition-colors">Termos de Serviço</Link></li>
              <li><Link href="/privacidade" className="hover:text-brand-blue transition-colors">Política de Privacidade</Link></li>
            </ul>
            <div className="mt-6">
              <p className="text-xs text-muted font-mono">CNPJ: 00.000.000/0001-00</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/30 py-6 text-center">
        <p className="text-xs text-muted">
          &copy; {currentYear} TRENDRUSH X. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}