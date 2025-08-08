import express from 'express';
import { registerUser, loginUser, getAllUsers } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', protect, getAllUsers);

export default router;
