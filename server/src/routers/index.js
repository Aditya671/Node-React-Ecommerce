import express from 'express';
import authRoutes from './auth/index.js';
import userRoutes from './users/index.js';
import productRoutes from './products/index.js'

const router = express.Router();

router.use('/v1',authRoutes);
router.use('/v1',userRoutes);
router.use('/v1',productRoutes);

export default router;