import { NextResponse } from "next/server";
import { cjDropshippingService } from "@/services/dropshipping/cj-service";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cjUrl, categoryId, marginMultiplier } = body;

    if (!cjUrl || !categoryId) {
      return NextResponse.json(
        { success: false, message: "URL da CJ e ID da Categoria são obrigatórios." },
        { status: 400 }
      );
    }

    const importedProduct = await cjDropshippingService.importProduct(
      cjUrl, 
      categoryId, 
      marginMultiplier ? Number(marginMultiplier) : undefined
    );

    return NextResponse.json({
      success: true,
      message: "Produto importado e mapeado com sucesso.",
      product: {
        id: importedProduct.id,
        name: importedProduct.name,
      }
    }, { status: 201 });

  } catch (error) {
    logger.error({ message: "Falha na rota admin de importação CJ", error });
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Erro Interno" },
      { status: 500 }
    );
  }
}