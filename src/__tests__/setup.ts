import { vi } from 'vitest';

// Mock global do Logger para não sujar o terminal durante os testes
vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

// Mock do Mercado Pago para evitar chamadas de rede reais
vi.mock('@/lib/mercadopago/client', () => ({
  mpPayment: {
    create: vi.fn(),
    get: vi.fn(),
  },
}));

// Limpa todos os mocks após cada teste
afterEach(() => {
  vi.clearAllMocks();
});