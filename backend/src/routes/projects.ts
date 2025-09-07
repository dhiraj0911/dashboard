import express from 'express';
import { createProject, getProjects, getProjectById, getUserProjects, updateProject, deleteProject } from '../controllers/projectController';
import { auth, adminAuth } from '../middleware/auth';

const router = express.Router();

// Admin routes
router.post('/', adminAuth, createProject);
router.get('/', adminAuth, getProjects);
router.put('/:id', adminAuth, updateProject);
router.delete('/:id', adminAuth, deleteProject);

// User routes
router.get('/my-projects', auth, getUserProjects);
router.get('/:id', auth, getProjectById);

export default router;
