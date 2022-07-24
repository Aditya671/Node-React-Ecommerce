import express from 'express';
import Auth from "../../controllers/auth/index.js"

const router = express.Router();
const auth = new Auth()

router.post('/login',auth.postLogin)
router.post('/logout',auth.postLogout)
router.post('/register',auth.postRegister)

export default router;