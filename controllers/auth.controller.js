import jwt from 'jsonwebtoken';
import { app } from '../data/data.js';

export const login = async (req, res) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  const jwtSecret = process.env.JWT_SECRET;
  const apiKey = app.options.apiKey;

  if (!jwtSecret || !apiKey) {
    console.error('Falta configurar JWT_SECRET o la API key de Firebase');
    return res.status(500).json({ error: 'El servicio de autenticación no está configurado' });
  }

  let firebaseResponse;
  try {
    firebaseResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );
  } catch (error) {
    console.error('No se pudo conectar con Firebase Authentication:', error);
    return res.status(502).json({ error: 'No se pudo conectar con el servicio de autenticación' });
  }

  const result = await firebaseResponse.json();
  if (!firebaseResponse.ok) {
    const firebaseError = result.error?.message;
    const firebaseErrorCode = typeof firebaseError === 'string'
      ? firebaseError.split(':')[0].trim()
      : 'UNKNOWN_FIREBASE_ERROR';

    if (
      ['EMAIL_NOT_FOUND', 'INVALID_PASSWORD', 'INVALID_LOGIN_CREDENTIALS', 'USER_DISABLED']
        .includes(firebaseErrorCode)
    ) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    console.error('Firebase Authentication rechazó la solicitud:', firebaseErrorCode);
    return res.status(502).json({
      error: 'Firebase Authentication no pudo completar el inicio de sesión',
      code: firebaseErrorCode,
    });
  }

  const token = jwt.sign(
    { uid: result.localId, email: result.email },
    jwtSecret,
    { expiresIn: '1h' }
  );

  return res.json({ token });
};
