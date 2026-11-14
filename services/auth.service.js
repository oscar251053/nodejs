import jwt from 'jsonwebtoken';
import { app } from '../data/data.js';

export class InvalidCredentialsError extends Error {
  constructor(message = 'Credenciales inválidas') {
    super(message);
    this.name = 'InvalidCredentialsError';
  }
}

export class AuthServiceConfigurationError extends Error {
  constructor(message = 'El servicio de autenticación no está configurado') {
    super(message);
    this.name = 'AuthServiceConfigurationError';
  }
}

export class ExternalAuthServiceError extends Error {
  constructor(message = 'No se pudo conectar con el servicio de autenticación', code) {
    super(message);
    this.name = 'ExternalAuthServiceError';
    this.code = code;
  }
}

export async function authenticateUser(email, password) {
  const jwtSecret = process.env.JWT_SECRET;
  const apiKey = app.options.apiKey;

  if (!jwtSecret || !apiKey) {
    console.error('Falta configurar JWT_SECRET o la API key de Firebase');
    throw new AuthServiceConfigurationError();
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
    throw new ExternalAuthServiceError('No se pudo conectar con el servicio de autenticación');
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
      throw new InvalidCredentialsError('Credenciales inválidas');
    }

    console.error('Firebase Authentication rechazó la solicitud:', firebaseErrorCode);
    throw new ExternalAuthServiceError(
      'Firebase Authentication no pudo completar el inicio de sesión',
      firebaseErrorCode
    );
  }

  const token = jwt.sign(
    { uid: result.localId, email: result.email },
    jwtSecret,
    { expiresIn: '1h' }
  );

  return token;
}

