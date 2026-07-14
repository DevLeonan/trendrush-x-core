import { z } from "zod";

export const checkoutSchema = z.object({
  // Dados Pessoais
  email: z.string().email({ message: "E-mail inválido. Verifique a digitação." }),
  name: z.string().min(3, { message: "Digite seu nome completo." }),
  document: z.string().min(14, { message: "CPF/CNPJ inválido." }), // 14 com máscara
  phone: z.string().min(14, { message: "Telefone inválido." }),

  // Endereço de Entrega
  zipCode: z.string().min(9, { message: "CEP incompleto." }),
  street: z.string().min(3, { message: "Endereço inválido." }),
  number: z.string().min(1, { message: "Número obrigatório." }),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, { message: "Bairro obrigatório." }),
  city: z.string().min(2, { message: "Cidade obrigatória." }),
  state: z.string().length(2, { message: "UF inválida." }),

  // Pagamento
  paymentMethod: z.enum(["PIX", "CREDIT_CARD"], {
    required_error: "Selecione uma forma de pagamento.",
  }),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;