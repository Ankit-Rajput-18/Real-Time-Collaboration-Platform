import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import nodemailer from 'nodemailer';

// Email Transporter Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
});

export const register = async (req, res) => {
  try {
    console.log('\n✉️  REGISTER REQUEST');
    
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create user
    const user = new User({ 
      name, 
      email, 
      password,
      role: 'member',
      status: 'online'
    });
    
    await user.save();
    
    console.log('✅ User registered:', user._id);

    const token = generateToken(user._id, user.role);

    // Send welcome email
    try {
      await transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: '🎉 Welcome to CollabHub!',
        html: `
          <h2>Welcome ${name}!</h2>
          <p>Your account has been created successfully.</p>
          <p>Start collaborating with your team now!</p>
          <a href="http://localhost:3000/login">Login to CollabHub</a>
        `
      });
      console.log('📧 Welcome email sent');
    } catch (emailError) {
      console.log('⚠️  Email send failed:', emailError.message);
    }

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('❌ Register Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    console.log('\n🔐 LOGIN REQUEST');

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Update status to online
    user.status = 'online';
    await user.save();

    console.log('✅ Login successful');
    const token = generateToken(user._id, user.role);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        status: user.status
      }
    });
    
  } catch (error) {
    console.error('❌ Login Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('workspaces');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, avatar, bio } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, avatar, bio },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated',
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['online', 'offline', 'away'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { status, lastSeen: new Date() },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Status updated',
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { status: 'offline', lastSeen: new Date() });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
