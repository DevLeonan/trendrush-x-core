import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { logger } from "@/lib/logger";
import { OrderStatus } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Log bruto para auditoria logística
    await prisma.webhookLog.create({
      data: {
        source: "CJ_DROPSHIPPING",
        eventId: body?.cjOrderId || null,
        payload: body,
        status: "RECEIVED",
      }
    });

    const { cjOrderId, trackingNumber, orderStatus } = body;

    if (!cjOrderId || !trackingNumber) {
       return NextResponse.json({ success: true, message: "Payload ignorado: dados incompletos" });
    }

    // Se o status da CJ for 'Dispatched' (Despachado), atualizamos o rastreio
    if (orderStatus === "DISPATCHED") {
      const order = await prisma.order.findFirst({
        where: { cjOrderId },
      });

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            trackingNumber,
            status: OrderStatus.SHIPPED,
          },
        });

        // NOTA DE ARQUITETURA: Aqui, no futuro (Etapa de CRM/Marketing), 
        // emitiremos um evento para o serviço de E-mail/WhatsApp notificar o cliente que o pacote foi enviado.
        
        logger.info({ message: "Rastreio atualizado automaticamente via Webhook CJ", context: { orderId: order.id, trackingNumber } });
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    logger.error({ message: "Erro fatal no Webhook da CJ Dropshipping", error });
    return NextResponse.json({ success: false, message: "Erro Interno" }, { status: 500 });
  }
}