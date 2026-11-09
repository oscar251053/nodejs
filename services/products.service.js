import {
  deleteProduct,
  getAllProducts as getAllProductsFromModel,
  getProductById,
  saveProduct,
  updateProduct as updateProductInModel,
} from '../models/products.model.js';

export class ProductValidationError extends Error {}

const validateProduct = (productData) => {
  if (
    !productData
    || typeof productData !== 'object'
    || Array.isArray(productData)
    || typeof productData.name !== 'string'
    || !productData.name.trim()
    || typeof productData.price !== 'number'
    || !Number.isFinite(productData.price)
    || productData.price < 0
  ) {
    throw new ProductValidationError('El producto debe incluir un nombre y un precio válido');
  }
};

export const getAllProducts = async () => {
  return getAllProductsFromModel();
};

export const getProduct = async (id) => {
  return getProductById(id);
};

export const createNewProduct = async (productData) => {
  validateProduct(productData);
  return saveProduct(productData);
};

export const updateExistingProduct = async (id, productData) => {
  validateProduct(productData);
  return updateProductInModel(id, productData);
};

export const deleteProductById = async (id) => {
  return deleteProduct(id);
};
