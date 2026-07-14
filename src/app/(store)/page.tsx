import { HeroSection } from "@/components/store/home/hero-section";
import { ViralSection } from "@/components/store/home/viral-section";
import { Shield, Zap, RotateCcw, CreditCard } from "lucide-react";

export const metadata = {
  title: "TRENDRUSH X | O Futuro do E-commerce",
  description: "Encontre os produtos mais virais e exclusivos com os melhores preços. Frete expresso e garantia total.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero / Primeira Dobra */}
      <HeroSection />

      {/* 2. Banner de Benefícios (Proof / Trust) */}
      <section className="border-y border-border bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="bg-brand-blue/10 p-3 rounded-full">
                <Zap className="w-6 h-6 text-brand-blue" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Envio Rápido</h4>
                <p className="text-muted text-xs">Processamento expresso</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="bg-brand-purple/10 p-3 rounded-full">
                <CreditCard className="w-6 h-6 text-brand-purple" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Parcelamento</h4>
                <p className="text-muted text-xs">Em até 12x no cartão</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="bg-brand-green/10 p-3 rounded-full">
                <Shield className="w-6 h-6 text-brand-green" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Compra Segura</h4>
                <p className="text-muted text-xs">Proteção contra fraudes</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="bg-brand-red/10 p-3 rounded-full">
                <RotateCcw className="w-6 h-6 text-brand-red" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Garantia 7 Dias</h4>
                <p className="text-muted text-xs">Devolução simplificada</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Vitrine Principal - Produtos Virais */}
      <ViralSection />

      {/* 4. Banner CTA de Quebra de Objeção */}
      <section className="py-20 bg-card/20 border-t border-border">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Padrão de Qualidade TREND<span className="text-brand-blue">RUSH</span> X
          </h2>
          <p className="text-muted text-lg mb-8">
            Não somos uma loja genérica. Inspecionamos, testamos e validamos cada fornecedor. 
            Se não tiver qualidade Apple/Tesla, não entra em nosso catálogo. 
            Você está protegido pela Garantia Incondicional.
          </p>
          <div className="flex justify-center gap-4 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Simulação de logos de parceiros/segurança */}
             <div className="h-10 w-24 bg-border/50 rounded flex items-center justify-center text-xs font-bold">SSL 256-bit</div>
             <div className="h-10 w-24 bg-border/50 rounded flex items-center justify-center text-xs font-bold">Mercado Pago</div>
             <div className="h-10 w-24 bg-border/50 rounded flex items-center justify-center text-xs font-bold">Google Safe</div>
          </div>
        </div>
      </section>
    </div>
  );
}