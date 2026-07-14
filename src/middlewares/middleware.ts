import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // 1. Injeção de Headers de Segurança (Helmet equivalente na Borda)
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.mercadopago.com https://developers.cjdropshipping.com;"
  );

  // 2. Proteção das Rotas Administrativas
  if (pathname.startsWith('/admin')) {
    const adminToken = request.cookies.get('admin_session')?.value;
    
    if (!adminToken && pathname !== '/admin/login') {
      const loginUrl = new URL('/admin/login', request.url);
      // Salva a URL original para redirecionamento após o login
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Sistema Base de Rate Limit contra Bots de Teste de Cartão (Proteção de Checkout)
  if (pathname.startsWith('/api/checkout')) {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    // Aqui injetaremos a lógica avançada de Rate Limiting futuro (ex: Redis/Upstash)
    response.headers.set('X-RateLimit-Limit', '20');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Intercepta todas as rotas de requisição, EXCETO:
     * 1. /api/webhooks/* (Webhooks têm sua própria verificação de assinatura)
     * 2. /_next/static (Arquivos estáticos)
     * 3. /_next/image (Otimização de imagens)
     * 4. /favicon.ico, /robots.txt (Arquivos estáticos de SEO)
     */
    '/((?!api/webhooks|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};