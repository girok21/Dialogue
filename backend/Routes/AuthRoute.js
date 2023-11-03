import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controller/AuthController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser).get('/logout', logoutUser);

export default router;
