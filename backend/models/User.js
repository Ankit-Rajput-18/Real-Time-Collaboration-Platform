import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  avatar: { 
    type: String, 
    default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' 
  },
  bio: {
    type: String,
    default: ''
  },
  role: { 
    type: String, 
    enum: ['admin', 'manager', 'member'], 
    default: 'member' 
  },
  status: { 
    type: String, 
    enum: ['online', 'offline', 'away'], 
    default: 'offline' 
  },
  workspaces: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Workspace' 
  }],
  lastSeen: {
    type: Date,
    default: Date.now
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(password) {
  return bcryptjs.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
