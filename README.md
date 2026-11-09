# API de productos

API REST desarrollada con Node.js y Express para consultar y administrar productos almacenados en Cloud Firestore. La autenticación de usuarios se realiza con Firebase Authentication y las operaciones privadas requieren un token JWT.

## Requisitos

- Node.js y npm.
- Un proyecto de Firebase con Cloud Firestore.
- Firebase Authentication habilitado con el proveedor de correo electrónico y contraseña.
- Un usuario registrado en Firebase Authentication para iniciar sesión.

## Instalación y configuración

1. Instala las dependencias desde la carpeta del proyecto:

   ```bash
   npm install
   ```

2. Crea un archivo `.env` en la raíz del proyecto:

   ```env
   PORT=3000
   JWT_SECRET=reemplazar-por-un-secreto-largo-y-aleatorio
   ```

   `PORT` es opcional; si no se define, el servidor usa el puerto `3000`. `JWT_SECRET` es obligatorio para iniciar sesión y verificar los tokens. Usa un valor aleatorio y privado, y no lo compartas ni lo subas al repositorio.

3. Configura los datos de tu proyecto Firebase en [`data/data.js`](./data/data.js). La configuración actual corresponde al proyecto Firebase definido allí. Asegúrate de que la aplicación tenga acceso a Firestore y crea la colección `products` si todavía no existe.

4. Inicia el servidor:

   ```bash
   npm run start
   ```

   Cuando arranque, quedará disponible en `http://localhost:3000` (o en el puerto configurado).

## Autenticación

Envía las credenciales de un usuario de Firebase Authentication a `POST /auth/login`. Si son válidas, la API responde con un JWT que vence en una hora:

```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "tu-contraseña"
}
```

Respuesta:

```json
{
  "token": "eyJ..."
}
```

Para crear, actualizar o eliminar productos, incluye ese token en el encabezado:

```http
Authorization: Bearer eyJ...
```

## Rutas

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/auth/login` | Público | Valida credenciales y devuelve un JWT. |
| `GET` | `/api/products` | Público | Devuelve todos los productos. |
| `GET` | `/api/products/:id` | Público | Devuelve el producto con ese ID. |
| `POST` | `/api/products/create` | JWT requerido | Crea un producto. |
| `PUT` | `/api/products/:id` | JWT requerido | Actualiza un producto existente. |
| `DELETE` | `/api/products/:id` | JWT requerido | Elimina un producto. |

Para crear o actualizar un producto, envía JSON con un nombre no vacío y un precio numérico mayor o igual a cero:

```json
{
  "name": "Teclado",
  "price": 25000
}
```

El ID de cada producto se genera en Firestore y se incluye en las respuestas. Usa ese ID en las rutas de consulta, actualización y eliminación.

### Ejemplos con `curl`

Iniciar sesión:

```bash
curl.exe -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email":"usuario@ejemplo.com","password":"tu-contraseña"}'
```

Consultar productos:

```bash
curl.exe http://localhost:3000/api/products
```

Crear un producto (reemplaza `TU_TOKEN` por el JWT recibido):

```bash
curl.exe -X POST http://localhost:3000/api/products/create -H "Authorization: Bearer TU_TOKEN" -H "Content-Type: application/json" -d '{"name":"Teclado","price":25000}'
```

Actualizar un producto:

```bash
curl.exe -X PUT http://localhost:3000/api/products/ID_DEL_PRODUCTO -H "Authorization: Bearer TU_TOKEN" -H "Content-Type: application/json" -d '{"name":"Teclado inalámbrico","price":30000}'
```

Eliminar un producto:

```bash
curl.exe -X DELETE http://localhost:3000/api/products/ID_DEL_PRODUCTO -H "Authorization: Bearer TU_TOKEN"
```

Los ejemplos usan `curl.exe`, disponible en Windows moderno. En macOS o Linux, puedes usar `curl` en lugar de `curl.exe`.

## Respuestas de error

- `400`: faltan credenciales o los datos del producto no son válidos.
- `401`: las credenciales de inicio de sesión son incorrectas o falta el token de acceso.
- `403`: el token JWT es inválido o expiró.
- `404`: la ruta no existe o no se encontró el producto solicitado para consultar o actualizar.
- `500`: error interno o de configuración del servidor.
- `502`: Firebase Authentication no está disponible o no pudo procesar la solicitud.

## Estructura del proyecto

- `index.js`: configura Express, CORS, JSON y las rutas.
- `routes/`: define las rutas de autenticación y productos.
- `controllers/`: procesa las solicitudes y respuestas HTTP.
- `services/`: valida datos y coordina las operaciones.
- `models/`: consulta y modifica los documentos de Firestore.
- `middlewares/`: verifica los tokens JWT.
- `data/`: inicializa y configura Firebase.
