import {
  createNewProduct,
  deleteProductById,
  getAllProducts,
  getProduct,
  ProductValidationError,
  updateExistingProduct,
} from '../services/products.service.js';

export const getProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('No se pudieron obtener los productos:', error);
    res.status(500).json({ error: 'No se pudieron obtener los productos' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await getProduct(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    console.error('No se pudo obtener el producto:', error);
    res.status(500).json({ error: 'No se pudo obtener el producto' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const newProduct = await createNewProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    if (error instanceof ProductValidationError) {
      return res.status(400).json({ error: error.message });
    }

    console.error('No se pudo crear el producto:', error);
    return res.status(500).json({ error: 'No se pudo crear el producto' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await updateExistingProduct(req.params.id, req.body);
    if (!updatedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
    return res.json(updatedProduct);
  } catch (error) {
    if (error instanceof ProductValidationError) {
      return res.status(400).json({ error: error.message });
    }

    console.error('No se pudo actualizar el producto:', error);
    return res.status(500).json({ error: 'No se pudo actualizar el producto' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await deleteProductById(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    return res.json({ message: 'Producto eliminado' });
  } catch (error) {
    console.error('No se pudo eliminar el producto:', error);
    return res.status(500).json({ error: 'No se pudo eliminar el producto' });
  }
};
