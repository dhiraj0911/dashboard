import { Request, Response } from 'express';
import Project from '../models/Project';
import Company from '../models/Company';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, powerbi_link, company } = req.body;

    const project = new Project({
      name,
      description,
      powerbi_link,
      company
    });

    await project.save();

    // Add project to company
    await Company.findByIdAndUpdate(
      company,
      { $push: { projects: project._id } }
    );

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.find()
      .populate('company', 'name')
      .populate('users', 'email');

    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id)
      .populate('company', 'name description')
      .populate('users', 'email');

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    
    const user = await User.findById(userId)
      .populate({
        path: 'projects',
        populate: {
          path: 'company',
          select: 'name'
        }
      });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user.projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, powerbi_link } = req.body;

    const project = await Project.findByIdAndUpdate(
      id,
      { name, description, powerbi_link },
      { new: true }
    ).populate('company users');

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Remove project reference from company and users
    await Company.updateOne(
      { _id: project.company },
      { $pull: { projects: id } }
    );

    await User.updateMany(
      { projects: id },
      { $pull: { projects: id } }
    );

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
