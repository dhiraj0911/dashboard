import { Request, Response } from 'express';
import Company from '../models/Company';
import User from '../models/User';

export const createCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;

    // Check if company already exists
    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      res.status(400).json({ message: 'Company already exists' });
      return;
    }

    const company = new Company({ name, description });
    await company.save();

    res.status(201).json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCompanies = async (req: Request, res: Response): Promise<void> => {
  try {
    const companies = await Company.find()
      .populate('projects', 'name description powerbi_link')
      .populate('users', 'email');

    res.json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCompanyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id)
      .populate('projects', 'name description powerbi_link')
      .populate('users', 'email');

    if (!company) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }

    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const company = await Company.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    ).populate('projects users');

    if (!company) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }

    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const company = await Company.findByIdAndDelete(id);
    if (!company) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }

    // Remove company reference from users
    await User.updateMany(
      { companies: id },
      { $pull: { companies: id } }
    );

    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
