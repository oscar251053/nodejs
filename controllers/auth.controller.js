import {
  authenticateUser,
  AuthServiceConfigurationError,
  ExternalAuthServiceError,
  InvalidCredentialsError,
} from '../services/auth.service.js';

export const login = async (req, res) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password.trim()) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  try {
    const token = await authenticateUser(email, password);
    return res.json({ token });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return res.status(401).json({ error: error.message });
    }

    if (error instanceof ExternalAuthServiceError) {
      // Requerimiento: código de estado 500 cuando nuestros servicios externos de datos no responden
      return res.status(500).json({
        error: error.message,
        ...(error.code ? { code: error.code } : {}),
      });
    }

    if (error instanceof AuthServiceConfigurationError) {
      return res.status(500).json({ error: error.message });
    }

    console.error('Error interno en login:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
