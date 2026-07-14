"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects (Tesla/Apple style) */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-blue/20 blur-[120px] rounded-[100%]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-purple/20 blur-[150px] rounded-full" />
      <div className="absolute inset-0 bg-[url('/assets/images/grid-pattern.svg')] opacity-10" />

      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center max-w-4xl"
        >
          {/* Badge de Lançamento */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-md mb-8"
          >
            <Flame className="w-4 h-4 text-brand-red animate-pulse" />
            <span className="text-sm font-medium text-muted">A revolução do e-commerce chegou</span>
          </motion.div>

          {/* Título Principal */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6 leading-[1.1]">
            DESCUBRA O <br />
            <span className="text-transparent bg-clip-text bg-gradient-premium">FUTURO VIRAL</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-lg md:text-xl text-muted max-w-2xl mb-10 leading-relaxed font-light">
            Os produtos mais cobiçados do TikTok e Instagram. 
            Importados com qualidade premium, envio expresso e garantia incondicional de satisfação.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" variant="premium" className="group">
              Explorar Ofertas
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="backdrop-blur-md">
              Ver Produtos Virais
            </Button>
          </div>
        </motion.div>

        {/* Indicador de Scroll */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted font-medium uppercase tracking-widest">Role para descobrir</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-brand-blue to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}