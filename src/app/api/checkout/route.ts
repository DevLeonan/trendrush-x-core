import { NextResponse } from "next/server";
import { checkoutService } from "@/services/orders/checkout-service";
import { apiCheckoutPayloadSchema } from "@/validations/api-checkout-schema";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Proteção de Borda: Validação Imutável com Zod
    const validation = apiCheckoutPayloadSchema.safeParse(body);
    
    if (!validation.success) {
      logger.warn({ message: "Payload de Checkout inválido recebido", context: validation.error.flatten() });
      return NextResponse.json(
        { 
          success: false, 
          errors: validation.error.flatten().fieldErrors 
        }, 
        { status: 400 }
      );
    }

    // Processamento Seguro
    const result = await checkoutService.process(validation.data);

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    logger.error({ message: "Falha na Rota de API /checkout", error });
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "Erro interno no servidor." 
      }, 
      { status: 500 }
    );
  }
}