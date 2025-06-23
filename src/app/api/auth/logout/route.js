import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Déconnecté avec succès' });

  // Supprime le cookie nommé "token"
  response.cookies.set('token', '', {
    httpOnly: true,
    expires: new Date(0), // Supprime le cookie
  });

  return response;
}
