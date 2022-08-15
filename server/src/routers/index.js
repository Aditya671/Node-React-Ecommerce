import express from 'express';
import authRouter from './auth/index.js';
import userRoute from './users/index.js';


const router = express.Router();

router.use('/v1',authRouter);
router.use('/v1',userRoute);

export default router;