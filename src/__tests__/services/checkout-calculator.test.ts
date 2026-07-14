import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkoutService } from '@/services/orders/checkout-service';
import { prisma } from '@/lib/prisma/client';
import { PaymentMethod } from '@prisma/client';

// Injeta o mock diretamente no Prisma Client
vi.mock('@/lib/prisma/client', () => ({
  prisma: {
    productVariant: {
      findMany: vi.fn(),
    },
    order: {
      create: vi.fn(),
    },
    user: {
      upsert: vi.fn(),
    },
  },
}));

describe('Checkout Service - Mathematical & Security Validation', () => {
  const mockCustomer = {
    email: 'teste@trendrushx.com',
    name: 'Cliente Teste',
    document: '123.456.789-00',
    phone: '(11) 99999-9999',
    zipCode: '01001-000',
    street: 'Praça da Sé',
    number: '1',
    neighborhood: 'Sé',
    city: 'São Paulo',
    state: 'SP',
    paymentMethod: 'PIX' as PaymentMethod,
  };

  beforeEach(() => {
    // Configura o mock do banco de dados para retornar variantes válidas e seguras
    (prisma.productVariant.findMany as any).mockResolvedValue([
      {
        id: 'var-1',
        price: 100.00,
        inventory: 10,
        name: 'Variante Padrão',
        product: { costPrice: 40.00 },
      },
    ]);
  });

  it('Deve calcular corretamente o desconto de 5% para PIX', async () => {
    const payload = {
      customer: mockCustomer,
      items: [{ variantId: 'var-1', quantity: 2 }], // 2 x 100 = 200
    };

    // Sobrescrevemos o orderRepository para apenas interceptar os dados calculados sem salvar
    const spy = vi.spyOn(require('@/repositories/order-repository').orderRepository, 'createCompleteOrder')
      .mockResolvedValue({ id: 'order-123', orderNumber: 'TR-TEST' });

    const result = await checkoutService.process(payload);

    // Subtotal esperado = 200
    // Desconto PIX 5% de 200 = 10
    // Total esperado = 190
    expect(result.success).toBe(true);
    expect(result.totalAmount).toBe(190.00);

    // Valida o payload injetado no Repositório
    const repoCallArg = spy.mock.calls[0][0];
    expect(repoCallArg.financials.subtotal).toBe(200);
    expect(repoCallArg.financials.discountAmount).toBe(10);
  });

  it('Deve lançar erro de segurança ao enviar quantidade zero ou negativa (Anti-Hack)', async () => {
    const payload = {
      customer: mockCustomer,
      items: [{ variantId: 'var-1', quantity: -5 }], // Ataque para forçar saldo negativo
    };

    // A validação inicial na API ou dentro do serviço deve interceptar isso
    await expect(checkoutService.process(payload)).rejects.toThrow();
  });

  it('Deve lançar erro se o produto solicitado estiver sem estoque', async () => {
    (prisma.productVariant.findMany as any).mockResolvedValue([
      {
        id: 'var-1',
        price: 100.00,
        inventory: 0, // Sem estoque
        name: 'Variante Padrão',
        product: { costPrice: 40.00 },
      },
    ]);

    const payload = {
      customer: mockCustomer,
      items: [{ variantId: 'var-1', quantity: 1 }],
    };

    await expect(checkoutService.process(payload)).rejects.toThrow('Estoque insuficiente para o item: Variante Padrão');
  });

  it('Deve ignorar o preço enviado pelo Frontend e usar a fonte da verdade do Banco de Dados', async () => {
    // Um atacante tenta enviar um payload injetando um unitPrice de R$ 0,01
    const hackedPayload = {
      customer: mockCustomer,
      items: [
        { 
          variantId: 'var-1', 
          quantity: 1,
          unitPrice: 0.01 // Tentativa de fraude (O sistema não lê isso da requisição na nossa arquitetura)
        }
      ], 
    };

    const spy = vi.spyOn(require('@/repositories/order-repository').orderRepository, 'createCompleteOrder')
      .mockResolvedValue({ id: 'order-123', orderNumber: 'TR-TEST' });

    await checkoutService.process(hackedPayload);

    // O repositório DEVE receber 100 (que é o valor retornado do banco mockado), e não 0.01
    const repoCallArg = spy.mock.calls[0][0];
    expect(repoCallArg.items[0].unitPrice).toBe(100.00);
    expect(repoCallArg.financials.subtotal).toBe(100.00);
  });
});