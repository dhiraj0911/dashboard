import express from 'express';
import { login, createUser, getUsers, getUserProfile, updateUserAccess } from '../controllers/authController';
import { auth, adminAuth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes (admin only)
router.post('/users', adminAuth, createUser);
router.get('/users', adminAuth, getUsers);
router.put('/users/:userId/access', adminAuth, updateUserAccess);

// Protected routes (authenticated users)
router.get('/profile', auth, getUserProfile);

export default router;
