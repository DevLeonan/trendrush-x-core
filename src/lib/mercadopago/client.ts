import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  throw new Error('Variável de ambiente MERCADOPAGO_ACCESS_TOKEN não está definida.');
}

// Configuração central do cliente Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  options: { 
    timeout: 10000, // Timeout estrito para evitar travamento no checkout
    idempotencyKey: true 
  }
});

// Exportação dos serviços que serão consumidos pela nossa API
export const mpPayment = new Payment(client);
export const mpPreference = new Preference(client);