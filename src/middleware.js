import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/admin') || pathname.startsWith('/api/gerant')) {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    // ⚠️ Pas de vérification du token ici (Edge runtime)
    // ➕ Tu peux bloquer si token est manquant
    if (!token) {
      return NextResponse.json({ message: 'Non authentifié.' }, { status: 401 });
    }

    // Laisse passer la requête, la vérification du rôle se fait dans la route API
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*', '/api/gerant/:path*'],
};
