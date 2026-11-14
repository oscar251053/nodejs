# API REST de Productos

API REST desarrollada con Node.js y Express para gestionar productos con Firebase Firestore. La autenticación de usuarios se realiza con Firebase Authentication y las operaciones sensibles requieren un token JWT válido.

## Descripción

Se implementó una API para:

- Registrar e iniciar sesión de usuarios con Firebase Authentication.
- Consultar todos los productos o uno por ID.
- Crear, actualizar y eliminar productos mediante JWT.
- Desplegar la aplicación en Vercel para acceso público.

## Tecnologías

- Node.js
- Express
- Firebase Firestore
- Firebase Authentication
- JWT
- Vercel

## Requisitos

- Node.js (v18+)
- npm
- Cuenta de Firebase con Firestore y Firebase Authentication habilitados
- Cuenta de Vercel para despliegue

## Instalación

1. Clona el repositorio:

   ```bash
   git clone <url-del-repositorio>
   cd src
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto (puedes basarte en `.env.example`):

   ```env
   PORT=3000
   JWT_SECRET=tu_secreto_seguro
   FIREBASE_API_KEY=tu_api_key
   FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
   FIREBASE_PROJECT_ID=tu_proyecto
   FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
   FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
   FIREBASE_APP_ID=tu_app_id
   ```

4. Inicia la aplicación:

   ```bash
   npm start
   ```

La API quedará disponible en:

```text
http://localhost:3000
```

## Rutas

### Autenticación

- `POST /auth/login`

Ejemplo de request:

```json
{
  "email": "usuario@ejemplo.com",
  "password": "tu_contraseña"
}
```

Respuesta esperada:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Productos

- `GET /api/products` (público - obtiene todos los productos)
- `GET /api/products/:id` (público - obtiene un producto por ID)
- `POST /api/products/create` (requiere Bearer Token - crea un producto)
- `PUT /api/products/:id` (requiere Bearer Token - actualiza un producto)
- `DELETE /api/products/:id` (requiere Bearer Token - elimina un producto)

### Ejemplo producto

```json
{
  "name": "Teclado",
  "price": 25000
}
```

## Autenticación JWT

Para acceder a las rutas protegidas, enviar el token en el encabezado HTTP:

```http
Authorization: Bearer TU_TOKEN
```

## Despliegue en Vercel

La aplicación fue desplegada y probada en producción con la siguiente URL pública:

```text
https://src-ten-sable-53.vercel.app
```

### Endpoints públicos verificados

- `https://src-ten-sable-53.vercel.app/api/products`
- `https://src-ten-sable-53.vercel.app/auth/login`

## Verificación final

Checklist realizado:

- [x] Configuración inicial de Node.js y ESModules (`type: module`, script `start`)
- [x] Instalación de dependencias requeridas (`express`, `cors`, `body-parser`, `dotenv`, `firebase`, `jsonwebtoken`)
- [x] Configuración de Express, CORS y middleware global body-parser
- [x] Middleware 404 para rutas desconocidas y manejo de errores 400, 401, 403 y 500
- [x] Capa de rutas (`products.routes.js` y `auth.routes.js`)
- [x] Capa de controladores (`products.controller.js` y `auth.controller.js`)
- [x] Capa de servicios (`products.service.js` y `auth.service.js`)
- [x] Capa de modelos (`products.model.js`) conectada a Firestore
- [x] Middleware de autenticación JWT y rutas protegidas
- [x] Proyecto desplegado en Vercel y URL pública activa

## Estructura del proyecto

```text
src/
├── controllers/
│   ├── auth.controller.js
│   └── products.controller.js
├── data/
│   └── data.js
├── middlewares/
│   └── auth.middleware.js
├── models/
│   └── products.model.js
├── routes/
│   ├── auth.routes.js
│   └── products.routes.js
├── services/
│   ├── auth.service.js
│   └── products.service.js
├── .env
├── .env.example
├── index.js
├── package.json
├── README.md
└── vercel.json
```

## Observaciones

- La ruta raíz `/` devuelve `404`, ya que la API expone endpoints específicos como `/api/products` y `/auth/login`.
- Los productos se almacenan en la colección `products` de Firestore.

## Autor

Proyecto finalizado y validado según los requerimientos de la consigna PFI.
