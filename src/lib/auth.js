import { verifyToken } from './jwt';

export async function getUserFromRequest(req) {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');

  console.log("🔍 Authorization header:", authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("🚫 Pas de token ou mauvais format.");
    return null;
  }

  const token = authHeader.split(' ')[1];

  try {
    // Si verifyToken est synchrone, enlève le await
    const decoded = await verifyToken(token);
    console.log("🔐 Token décodé:", decoded);
    return decoded;
  } catch (error) {
    console.log("❌ Erreur lors de la vérification du token:", error.message);
    return null;
  }
}
