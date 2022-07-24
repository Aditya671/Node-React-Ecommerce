import express from 'express';
import authRouter from './auth/index.js';

const router = express.Router();

router.use('/v1',authRouter);

export default router;