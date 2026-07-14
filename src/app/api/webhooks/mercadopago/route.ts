import { NextResponse } from "next/server";
import { mercadoPagoService } from "@/services/payments/mercadopago-service";
import { prisma } from "@/lib/prisma/client";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get("topic") || url.searchParams.get("type");
    
    const body = await request.json();

    // Log bruto para auditoria financeira
    await prisma.webhookLog.create({
      data: {
        source: "MERCADO_PAGO",
        eventId: body?.data?.id?.toString() || null,
        payload: body,
        status: "RECEIVED",
      }
    });

    // O Mercado Pago envia o ID do pagamento de duas formas diferentes dependendo do evento
    const paymentId = body?.data?.id || body?.resource?.split("/").pop();

    if (!paymentId) {
      return NextResponse.json({ success: true, message: "Ignorado - Sem Payment ID" }, { status: 200 });
    }

    // Processa apenas notificações de pagamento
    if (action === "payment") {
      await mercadoPagoService.processWebhook(paymentId.toString());
    }

    // Sempre retornamos 200 OK rapidamente para o Mercado Pago não tentar reenviar
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    logger.error({ message: "Erro fatal na rota de Webhook do Mercado Pago", error });
    
    // Retornamos 500 para que o MP coloque a notificação na fila de retentativas
    return NextResponse.json(
      { success: false, message: "Internal Error" }, 
      { status: 500 }
    );
  }
}