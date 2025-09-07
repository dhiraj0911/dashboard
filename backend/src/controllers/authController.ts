import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).populate('companies projects');
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        companies: user.companies,
        projects: user.projects
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, isAdmin = false, companies = [], projects = [] } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Validate that all projects belong to the selected companies
    if (projects && projects.length > 0 && companies && companies.length > 0) {
      const Project = require('../models/Project').default;
      const projectDocs = await Project.find({ _id: { $in: projects } }).populate('company');
      
      for (const project of projectDocs) {
        const projectCompanyId = typeof project.company === 'object' ? 
          project.company._id.toString() : 
          project.company.toString();
        
        if (!companies.includes(projectCompanyId)) {
          res.status(400).json({ 
            message: `Project "${project.name}" cannot be assigned because it doesn't belong to any of the selected companies.` 
          });
          return;
        }
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      isAdmin,
      companies,
      projects
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        companies: user.companies,
        projects: user.projects
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('companies', 'name')
      .populate({
        path: 'projects',
        select: 'name powerbi_link',
        populate: {
          path: 'company',
          select: 'name'
        }
      });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id)
      .select('-password')
      .populate({
        path: 'companies',
        select: 'name description',
        populate: {
          path: 'projects',
          select: 'name description powerbi_link'
        }
      })
      .populate('projects', 'name description powerbi_link company');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserAccess = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { companies, projects } = req.body;

    // Validate that all projects belong to the selected companies
    if (projects && projects.length > 0 && companies && companies.length > 0) {
      const Project = require('../models/Project').default;
      const projectDocs = await Project.find({ _id: { $in: projects } }).populate('company');
      
      for (const project of projectDocs) {
        const projectCompanyId = typeof project.company === 'object' ? 
          project.company._id.toString() : 
          project.company.toString();
        
        if (!companies.includes(projectCompanyId)) {
          res.status(400).json({ 
            message: `Project "${project.name}" cannot be assigned because user doesn't have access to its company.` 
          });
          return;
        }
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { companies, projects },
      { new: true }
    ).select('-password').populate('companies projects');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
