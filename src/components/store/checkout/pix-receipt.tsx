"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Copy, CheckCircle, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PixReceiptProps {
  qrCodeBase64: string;
  copyPaste: string;
  amount: number;
  orderNumber: string;
}

export function PixReceipt({ qrCodeBase64, copyPaste, amount, orderNumber }: PixReceiptProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(copyPaste);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card/40 border border-border/50 rounded-2xl p-8 backdrop-blur-md shadow-glass max-w-md mx-auto text-center"
    >
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center">
          <QrCode className="w-8 h-8 text-brand-green" />
        </div>
      </div>

      <h2 className="text-2xl font-black text-white mb-2">Pedido {orderNumber}</h2>
      <p className="text-muted text-sm mb-8">
        Quase lá! Escaneie o QR Code ou copie o código abaixo para finalizar sua compra.
      </p>

      {/* QR Code Image */}
      <div className="flex justify-center mb-8">
        <div className="p-4 bg-white rounded-xl shadow-[0_0_20px_rgba(0,255,153,0.2)]">
          <Image 
            src={`data:image/png;base64,${qrCodeBase64}`} 
            alt="QR Code PIX" 
            width={200} 
            height={200} 
            className="rounded-lg"
          />
        </div>
      </div>

      <div className="text-3xl font-black text-brand-green mb-8">
        R$ {amount.toFixed(2).replace('.', ',')}
      </div>

      {/* Copia e Cola */}
      <div className="space-y-3">
        <label className="text-xs text-muted font-bold uppercase tracking-wider block text-left">
          Código PIX (Copia e Cola)
        </label>
        <div className="flex gap-2">
          <input 
            type="text" 
            readOnly 
            value={copyPaste}
            className="flex-1 h-12 bg-background border border-border rounded-lg px-4 text-sm text-muted focus:outline-none"
          />
          <Button 
            onClick={handleCopy} 
            variant={copied ? "success" : "premium"}
            className="h-12 px-6"
          >
            {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted">
        <div className="w-2 h-2 bg-brand-blue rounded-full animate-pulse" />
        Aguardando confirmação do pagamento...
      </div>
    </motion.div>
  );
}