import { cjClient } from "@/lib/cj-dropshipping/client";
import { prisma } from "@/lib/prisma/client";
import { logger } from "@/lib/logger";
import { ProductStatus } from "@prisma/client";

// Tipagem baseada na documentação oficial da API V2 da CJ Dropshipping
interface CJProductDetailResponse {
  data: {
    pid: string;
    productName: string;
    productNameEn: string;
    productImage: string;
    productWeight: number;
    description: string;
    sellPrice: number; // Preço sugerido
    sourcePrice: number; // Custo real do produto
    variants: Array<{
      vid: string;
      variantKey: string;
      variantName: string;
      variantNameEn: string;
      variantImage: string;
      variantPrice: number;
      variantWeight: number;
      variantInventory: number;
    }>;
    images: string[];
  };
}

export class CJDropshippingService {
  /**
   * Extrai o ID do produto da URL da CJ Dropshipping
   */
  private extractProductId(urlOrId: string): string {
    if (!urlOrId.includes("http")) return urlOrId;
    const match = urlOrId.match(/\/([a-zA-Z0-9-]+)(\.html|\?|$)/);
    return match ? match[1] : urlOrId;
  }

  /**
   * 1. IMPORTADOR CJ: Busca, processa e salva o produto e suas variantes no banco.
   */
  async importProduct(cjUrl: string, categoryId: string, marginMultiplier = 2.5) {
    try {
      const pid = this.extractProductId(cjUrl);
      logger.info({ message: "Iniciando importação CJ", context: { pid } });

      // Requisição à API da CJ
      const response = await cjClient.fetch<CJProductDetailResponse>(`/product/detail?pid=${pid}`);
      const cjData = response.data;

      if (!cjData) {
        throw new Error("Produto não encontrado na base da CJ Dropshipping.");
      }

      // Prepara o Slug único
      const slug = cjData.productNameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50) + `-${pid.slice(-4)}`;

      // Executa a importação garantindo Atomicidade (Tudo ou Nada)
      const savedProduct = await prisma.$transaction(async (tx) => {
        // 1. Cria o Produto Base
        const product = await tx.product.create({
          data: {
            categoryId,
            name: cjData.productNameEn, // O painel Admin futuramente chamará uma IA para traduzir o nome
            slug,
            shortDescription: "Produto importado. Edite esta descrição para alta conversão.",
            description: cjData.description,
            status: ProductStatus.DRAFT, // Entra como rascunho para edição de Copy/SEO
            supplierUrl: `https://cjdropshipping.com/product-detail/${pid}.html`,
            supplierId: pid,
            costPrice: cjData.sourcePrice,
            isViral: false,
            
            // 2. Relaciona as Imagens do Produto
            images: {
              create: cjData.images.map((url, index) => ({
                url,
                altText: `${cjData.productNameEn} - Imagem ${index + 1}`,
                order: index,
              })),
            },

            // 3. Relaciona as Variantes (SKUs)
            variants: {
              create: cjData.variants.map((variant) => ({
                sku: variant.vid,
                name: variant.variantNameEn,
                price: variant.variantPrice * marginMultiplier, // Aplica markup automático
                compareAtPrice: (variant.variantPrice * marginMultiplier) * 1.5, // Gera escassez de 33% OFF falso
                inventory: variant.variantInventory,
                weight: variant.variantWeight / 1000, // CJ retorna em gramas, salvamos em KG
                imageUrl: variant.variantImage,
              })),
            },
          },
        });

        return product;
      });

      logger.info({ message: "Produto importado com sucesso", context: { productId: savedProduct.id } });
      return savedProduct;

    } catch (error) {
      logger.error({ message: "Erro na importação da CJ", error, context: { cjUrl } });
      throw new Error("Falha ao importar o produto da CJ. Verifique o link e o token de API.");
    }
  }

  /**
   * 2. FULFILLMENT AUTOMÁTICO: Envia o pedido pago direto para a CJ Dropshipping
   */
  async fulfillOrder(orderId: string) {
    try {
      // 1. Busca os dados completos do pedido
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true, user: true },
      });

      if (!order || order.status !== "PROCESSING") {
        throw new Error("Pedido não encontrado ou não está pronto para fulfillment.");
      }

      // O address está armazenado como Json, garantimos o tipo
      const address = order.shippingAddress as any;

      // 2. Monta o Payload no formato exigido pela CJ Dropshipping
      const cjOrderPayload = {
        orderNumber: order.orderNumber,
        shippingZip: address.zipCode.replace(/\D/g, ""),
        shippingCountry: "BR",
        shippingProvince: address.state,
        shippingCity: address.city,
        shippingAddress: `${address.street}, ${address.number} - ${address.complement || ""}`,
        shippingCustomerName: order.user?.name || order.guestEmail?.split("@")[0] || "Cliente",
        shippingPhone: order.user?.phone || "00000000000",
        remark: "Dropshipping Order - Do not include invoice", // Evita envio de nota fiscal chinesa
        products: order.items.map((item) => ({
          vid: item.variantId, // Aqui assumimos que o variantId no BD é igual ao vid da CJ
          quantity: item.quantity,
        })),
      };

      logger.info({ message: "Disparando pedido para CJ Dropshipping", context: { orderNumber: order.orderNumber } });

      // 3. Chama a API de Criação de Pedido da CJ
      const response = await cjClient.fetch<{ data: { cjOrderId: string } }>("/shopping/order/createOrder", {
        method: "POST",
        body: cjOrderPayload,
      });

      if (!response.data?.cjOrderId) {
        throw new Error("CJ não retornou o ID do pedido gerado.");
      }

      // 4. Atualiza nosso banco de dados com o ID da CJ
      await prisma.order.update({
        where: { id: order.id },
        data: {
          cjOrderId: response.data.cjOrderId,
        },
      });

      logger.info({ message: "Pedido processado com a CJ Dropshipping", context: { cjOrderId: response.data.cjOrderId } });
      
      return response.data.cjOrderId;

    } catch (error) {
      logger.error({ message: "Falha catastrófica no Fulfillment", error, context: { orderId } });
      throw error;
    }
  }
}

export const cjDropshippingService = new CJDropshippingService();