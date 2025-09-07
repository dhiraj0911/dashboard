import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  isAdmin: boolean;
  companies: mongoose.Types.ObjectId[];
  projects: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  companies: [{
    type: Schema.Types.ObjectId,
    ref: 'Company'
  }],
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }]
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
