"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, CreditCard, QrCode, ShieldCheck, Loader2 } from "lucide-react";
import { checkoutSchema, type CheckoutFormData } from "@/validations/checkout-schema";
import { formatDocument, formatCEP } from "@/utils/formatters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { useCartStore } from "@/store/use-cart-store";

export function CheckoutForm() {
  const { getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const [isSearchingCep, setIsSearchingCep] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "PIX",
    },
  });

  const paymentMethod = watch("paymentMethod");

  // Busca de CEP Automática (Integração ViaCEP)
  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length !== 8) return;

    setIsSearchingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setValue("street", data.logradouro, { shouldValidate: true });
        setValue("neighborhood", data.bairro, { shouldValidate: true });
        setValue("city", data.localidade, { shouldValidate: true });
        setValue("state", data.uf, { shouldValidate: true });
        // Foca no número após autocompletar
        document.getElementById("number")?.focus();
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    } finally {
      setIsSearchingCep(false);
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    // Na Etapa 17 e 18, integraremos isso com a API e o Mercado Pago
    console.log("Dados do Pedido:", data);
    
    // Simulação de processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    alert("Pedido processado com sucesso! (Mock)");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* 1. Dados Pessoais */}
      <div className="bg-card/30 border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-blue text-background text-xs font-black">1</span>
          Dados Pessoais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input 
              placeholder="E-mail" 
              type="email"
              {...register("email")}
              error={errors.email?.message}
            />
          </div>
          <Input 
            placeholder="Nome Completo" 
            {...register("name")}
            error={errors.name?.message}
          />
          <Input 
            placeholder="CPF ou CNPJ" 
            {...register("document")}
            onChange={(e) => {
              e.target.value = formatDocument(e.target.value);
              setValue("document", e.target.value);
            }}
            error={errors.document?.message}
          />
          <div className="md:col-span-2">
            <Input 
              placeholder="Telefone / WhatsApp" 
              {...register("phone")}
              // Máscara simplificada in-line para telefone
              onChange={(e) => {
                let v = e.target.value.replace(/\D/g, "");
                v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
                v = v.replace(/(\d)(\d{4})$/, "$1-$2");
                e.target.value = v;
                setValue("phone", v);
              }}
              error={errors.phone?.message}
            />
          </div>
        </div>
      </div>

      {/* 2. Endereço de Entrega */}
      <div className="bg-card/30 border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-blue text-background text-xs font-black">2</span>
          Entrega
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 relative">
            <Input 
              placeholder="CEP" 
              {...register("zipCode")}
              onBlur={handleCepBlur}
              onChange={(e) => {
                e.target.value = formatCEP(e.target.value);
                setValue("zipCode", e.target.value);
              }}
              error={errors.zipCode?.message}
            />
            {isSearchingCep && (
              <Loader2 className="w-4 h-4 text-brand-blue animate-spin absolute right-4 top-4" />
            )}
          </div>
          <div className="md:col-span-8 flex items-center gap-2 text-sm text-brand-green font-medium">
            <MapPin className="w-4 h-4" />
            Frete Expresso Grátis
          </div>

          <div className="md:col-span-9">
            <Input 
              placeholder="Rua / Avenida" 
              {...register("street")}
              error={errors.street?.message}
            />
          </div>
          <div className="md:col-span-3">
            <Input 
              id="number"
              placeholder="Número" 
              {...register("number")}
              error={errors.number?.message}
            />
          </div>

          <div className="md:col-span-6">
            <Input 
              placeholder="Complemento (Opcional)" 
              {...register("complement")}
            />
          </div>
          <div className="md:col-span-6">
            <Input 
              placeholder="Bairro" 
              {...register("neighborhood")}
              error={errors.neighborhood?.message}
            />
          </div>

          <div className="md:col-span-9">
            <Input 
              placeholder="Cidade" 
              {...register("city")}
              error={errors.city?.message}
            />
          </div>
          <div className="md:col-span-3">
            <Input 
              placeholder="UF" 
              maxLength={2}
              {...register("state")}
              onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
                setValue("state", e.target.value);
              }}
              error={errors.state?.message}
            />
          </div>
        </div>
      </div>

      {/* 3. Pagamento */}
      <div className="bg-card/30 border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-blue text-background text-xs font-black">3</span>
          Pagamento
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Seletor PIX */}
          <div 
            onClick={() => setValue("paymentMethod", "PIX")}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300",
              paymentMethod === "PIX" 
                ? "border-brand-green bg-brand-green/10" 
                : "border-border/50 bg-card/50 hover:border-border"
            )}
          >
            <QrCode className={cn("w-8 h-8 mb-2", paymentMethod === "PIX" ? "text-brand-green" : "text-muted")} />
            <span className={cn("font-bold", paymentMethod === "PIX" ? "text-brand-green" : "text-white")}>PIX</span>
            <span className="text-xs text-brand-green font-medium">-5% de Desconto</span>
          </div>

          {/* Seletor Cartão */}
          <div 
            onClick={() => setValue("paymentMethod", "CREDIT_CARD")}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300",
              paymentMethod === "CREDIT_CARD" 
                ? "border-brand-purple bg-brand-purple/10" 
                : "border-border/50 bg-card/50 hover:border-border"
            )}
          >
            <CreditCard className={cn("w-8 h-8 mb-2", paymentMethod === "CREDIT_CARD" ? "text-brand-purple" : "text-muted")} />
            <span className={cn("font-bold", paymentMethod === "CREDIT_CARD" ? "text-brand-purple" : "text-white")}>Cartão de Crédito</span>
            <span className="text-xs text-muted">Até 12x sem juros</span>
          </div>
        </div>

        {/* Input Oculto para validação */}
        <input type="hidden" {...register("paymentMethod")} />

        {/* Mensagem de Confiança */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted mb-6">
          <ShieldCheck className="w-4 h-4 text-brand-green" />
          Seus dados de pagamento são processados de forma segura pelo Mercado Pago.
        </div>

        {/* Botão Finalizar */}
        <Button 
          type="submit" 
          size="lg" 
          variant="premium" 
          isLoading={isSubmitting}
          className="w-full h-14 text-lg font-bold shadow-neon-purple animate-pulse-slow"
        >
          {paymentMethod === "PIX" ? "GERAR CÓDIGO PIX" : "FINALIZAR COMPRA"}
        </Button>
      </div>
    </form>
  );
}