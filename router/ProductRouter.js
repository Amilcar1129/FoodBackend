import express from  'express';
import { getProducts, getOneProduct, createProduct, updateProduct, deleteProduct } from '../controller/ProductController.js';
import { verifyToken } from '../middleware/auth.js';
import { isAdmin}  from '../middleware/isAdmin.js';
//import multer from 'multer';
import upload, { handleMulterError } from '../middleware/upload.js';

//CREACION DEL ROUTER
const router = express.Router();

//DEFINICION DE RUTAS ,RUTAS PUBLICAS
router.get('/products', getProducts);
router.get('/products/:id', getOneProduct);

//RUTAS PRIVADAS - SOLO ADMIN
router.post('/products', verifyToken, isAdmin, upload.single('image'),handleMulterError,createProduct);
router.put('/products/:id', verifyToken, isAdmin, upload.single('image'),updateProduct);
router.delete('/products/:id', verifyToken, isAdmin, deleteProduct);

export default router;