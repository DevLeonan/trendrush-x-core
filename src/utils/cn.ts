import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Mescla classes do Tailwind de forma inteligente, evitando conflitos de especificidade.
 * Exemplo: cn('px-2 py-1 bg-red-500', isLarge && 'p-4') resolverá corretamente os paddings.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}