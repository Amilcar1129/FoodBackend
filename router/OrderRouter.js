import express from 'express';
import { createOrder,
         getMyOrders,
         getAllOrders,
         getOrderById,
         updateOrderStatus,
         cancelarOrder
 } from '../controller/OrderController.js';
import { verifyToken } from '../middleware/auth.js';
import { isAdmin}  from '../middleware/isAdmin.js';

const router = express.Router();

//Rutas para clientes (necesitan token)

router.post('/orders', verifyToken, createOrder);
router.get('/myorders', verifyToken, getMyOrders);
router.get('/orders/:id', verifyToken, getOrderById);
router.put('/orders/:id/cancel', verifyToken, cancelarOrder);


//Rutas para admin (necesitan token y ser admin)

router.get('/orders', verifyToken, isAdmin, getAllOrders);
router.put('/orders/:id/status', verifyToken, isAdmin, updateOrderStatus);

export default router;