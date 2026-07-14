import { z } from "zod";
import { checkoutSchema } from "./checkout-schema";

export const apiCheckoutPayloadSchema = z.object({
  customer: checkoutSchema,
  items: z.array(
    z.object({
      variantId: z.string().uuid({ message: "ID de variante inválido." }),
      quantity: z.number().int().positive({ message: "Quantidade deve ser maior que zero." }),
    })
  ).min(1, { message: "O carrinho não pode estar vazio." }),
});

export type ApiCheckoutPayload = z.infer<typeof apiCheckoutPayloadSchema>;