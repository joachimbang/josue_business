import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token validé, payload:', decoded);
    return decoded;
  } catch (error) {
    console.log('❌ Erreur verifyToken:', error.message);
    return null;
  }
}

