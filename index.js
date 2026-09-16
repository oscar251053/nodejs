const API_URL = "https://fakestoreapi.com";

function obtenerComando() {
  const argumentos = process.argv.slice(2);
  const metodo = argumentos[0]?.toUpperCase();
  const recurso = argumentos[1]?.toLowerCase();

  if (!metodo || !recurso) {
    return null;
  }

  return { metodo, recurso, argumentos: argumentos.slice(2) };
}

function validarId(id) {
  if (!id || Number.isNaN(Number(id))) {
    throw new Error("Debes indicar un ID numérico de producto.");
  }

  return id;
}

async function consultarProductos(id) {
  const ruta = id ? `/products/${validarId(id)}` : "/products";
  const respuesta = await fetch(`${API_URL}${ruta}`);

  if (!respuesta.ok) {
    throw new Error(`La API respondió con el estado ${respuesta.status}.`);
  }

  const data = await respuesta.json();

  if (id) {
    console.clear();
    console.log(`Título: ${data.title}\n\nPrecio: USD ${data.price}\n\nCategoría: ${data.category}\n`);
    return;
  }

  console.clear();
  console.log("Listado de productos:\n");

  for (const producto of data) {
    console.log(`ID: ${producto.id}\nTítulo: ${producto.title}\nPrecio: USD ${producto.price}\nCategoría: ${producto.category}\n`);
  }
}

async function crearProducto(argumentos) {
  const [title, price, category] = argumentos;

  if (!title || !price || !category) {
    throw new Error("Para crear un producto debes indicar title, price y category.");
  }

  const precioNumerico = Number(price);
  if (Number.isNaN(precioNumerico)) {
    throw new Error("El precio debe ser un número.");
  }

  const respuesta = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      price: precioNumerico,
      category,
      description: "Sin descripción disponible",
    }),
  });

  if (!respuesta.ok) {
    throw new Error(`La API respondió con el estado ${respuesta.status}.`);
  }

  const respPOST = await respuesta.json();
  console.clear();
  console.log("Se agregó:\n");
  console.log(`Título: ${respPOST.title}\n\nPrecio: USD ${respPOST.price}\n\nCategoría: ${respPOST.category}\n`);
}

async function eliminarProducto(id) {
  const respuesta = await fetch(`${API_URL}/products/${validarId(id)}`, {
    method: "DELETE",
  });

  if (!respuesta.ok) {
    throw new Error(`La API respondió con el estado ${respuesta.status}.`);
  }

  const  respDEL =await respuesta.json()
  console.clear()
  console.log("Se borró:\n")
  console.log(`Título: ${respDEL.title}\n\nPrecio: USD ${respDEL.price}\n\nCategoría: ${respDEL.category}\n`)
}

async function ejecutar() {
  const comando = obtenerComando();

  if (!comando) {
    console.log("No es un comando válido");
    return;
  }

  if (comando.recurso !== "products") {
    throw new Error("Por ahora solo está disponible el recurso products.");
  }

  if (comando.metodo === "GET") {
    if (comando.argumentos.length > 1) {
      throw new Error("GET acepta como máximo un ID de producto.");
    }
    await consultarProductos(comando.argumentos[0]);
    return;
  }

  if (comando.metodo === "POST") {
    await crearProducto(comando.argumentos);
    return;
  }

  if (comando.metodo === "DELETE") {
    if (comando.argumentos.length !== 1) {
      throw new Error("DELETE necesita exactamente un ID de producto.");
    }
    await eliminarProducto(comando.argumentos[0]);
    return;
  }

  throw new Error(`El método ${comando.metodo} no está disponible.`);
}

ejecutar().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
