import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  // El estándar es enviar el token en el header: "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;
  const [scheme, token, ...extra] = authHeader?.split(' ') ?? [];

  if (scheme !== 'Bearer' || !token || extra.length > 0) {
    return res.status(401).json({ error: 'Acceso denegado. Se requiere un token Bearer.' });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('Falta configurar JWT_SECRET');
    return res.status(500).json({ error: 'El servicio de autenticación no está configurado' });
  }

  try {
    const verified = jwt.verify(token, jwtSecret);
    req.user = verified;
    return next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};
