import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '../controllers/products.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/create', verifyToken, createProduct);
router.put('/:id', verifyToken, updateProduct);
router.delete('/:id', verifyToken, deleteProduct);

export default router;
