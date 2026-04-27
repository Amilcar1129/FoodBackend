import express from 'express';
import upload from '../middleware/upload.js';    
import { uploadImage } from '../controller/UploadController.js';
import { verifyToken } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

//RUTA PARA SUBIR IMAGENES - SOLO ADMIN
router.post('/upload', verifyToken, isAdmin, upload.single('image'), uploadImage);

export default router;