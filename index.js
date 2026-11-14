import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import productsRoutes from './routes/products.routes.js';
import authRoutes from './routes/auth.routes.js';


// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middleware CORS: Permite peticiones desde el frontend
app.use(cors());

// 2. Middleware Body-Parser: Interpreta el cuerpo de las peticiones como JSON
app.use(bodyParser.json());

app.use('/api/products', productsRoutes);
app.use('/auth', authRoutes);

// 3. Middleware para rutas no encontradas (Error 404)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// 4. Middleware global de manejo de errores (Error 500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

export default app;
