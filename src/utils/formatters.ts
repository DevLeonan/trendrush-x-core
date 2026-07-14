/**
 * Formata números para o padrão monetário BRL (Real Brasileiro).
 */
export const formatCurrency = (value: number | string): string => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (Number.isNaN(numericValue)) return 'R$ 0,00';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numericValue);
};

/**
 * Calcula a porcentagem real de desconto baseada no preço antigo e no preço atual.
 */
export const calculateDiscountPercentage = (price: number, compareAtPrice: number): number => {
  if (!compareAtPrice || price >= compareAtPrice) return 0;
  const discount = ((compareAtPrice - price) / compareAtPrice) * 100;
  return Math.round(discount);
};

/**
 * Aplica máscara de CEP (00000-000).
 */
export const formatCEP = (cep: string): string => {
  return cep.replace(/\D/g, '').replace(/^(\d{5})(\d{3})$/, '$1-$2');
};

/**
 * Aplica máscara de CPF/CNPJ de forma dinâmica.
 */
export const formatDocument = (document: string): string => {
  const digits = document.replace(/\D/g, '');
  
  if (digits.length <= 11) {
    // Máscara de CPF
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  }
  
  // Máscara de CNPJ
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};