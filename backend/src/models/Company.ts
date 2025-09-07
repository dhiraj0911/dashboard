import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  description?: string;
  projects: mongoose.Types.ObjectId[];
  users: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }],
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

export default mongoose.model<ICompany>('Company', CompanySchema);
