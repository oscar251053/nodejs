const API_URL = "https://fakestoreapi.com";
const [, , method, resource, ...params] = process.argv;
const parseResource = (resource = "") => {
  const [base, id] = resource.split("/");
  return { base, id };
};
const request = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
  }
  return await response.json();
};

const showResult = (data) => {
  console.log(`\nID: ${data.id}\nTítulo: ${data.title}\nPrecio: USD ${data.price}\nCategoría: ${data.category}\n`);
};

const handleGET = async ({ base, id }) => {
  const url = id
    ? `${API_URL}/${base}/${id}`
    : `${API_URL}/${base}`;

  const data = await request(url);

  if (Array.isArray(data)) {
    data.forEach(showResult);
  } else {
    console.clear()
    showResult(data);
  }
};

const handlePOST = async ({ base }, params) => {
    const [title, price, category] = params;
    const newProduct = {
    title,
    price: Number(price),
    category,
  };

  const data = await request(`${API_URL}/${base}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProduct),
  });

  console.clear()
  console.log("Nuevo artículo agregado:")
  showResult(data);
};

const handleDELETE = async ({ base, id }) => {
    const data = await request(`${API_URL}/${base}/${id}`, {
    method: "DELETE",
  });

  console.clear()
  console.log("Se eliminó el artículo:")
  showResult(data);
};

const main = async () => {
  try {
    if (!method || !resource) {
      console.clear()
      console.log(`
Debes ejecutar un comando válido:
  npm start GET    products
  npm start GET    products/<id>
  npm start POST   products <title> <price> <category>
  npm start DELETE products/<id>
      `);
      return;
    }

    const { base, id } = parseResource(resource);

    // Switch para los distintos métodos
    switch (method) {
      case "GET":
        await handleGET({ base, id });
        break;

      case "POST":
        await handlePOST({ base }, params);
        break;

      case "DELETE":
        await handleDELETE({ base, id });
        break;

      default:
        throw new Error(
          `\nMétodo no soportado: "${method}". Usa GET, POST o DELETE.\n`
        );
    }
  } catch (error) {
    console.clear()
    console.error("❌ Error:", error.message);
    process.exitCode = 1;
  }
};

main();