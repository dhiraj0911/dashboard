import express from 'express';
import { createCompany, getCompanies, getCompanyById, updateCompany, deleteCompany } from '../controllers/companyController';
import { adminAuth } from '../middleware/auth';

const router = express.Router();

// All company routes require admin access
router.post('/', adminAuth, createCompany);
router.get('/', adminAuth, getCompanies);
router.get('/:id', adminAuth, getCompanyById);
router.put('/:id', adminAuth, updateCompany);
router.delete('/:id', adminAuth, deleteCompany);

export default router;
