import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Import your User model

const router = express.Router();

// --- REGISTER ---
// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // 1. Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ msg: 'Please provide username, email, and password' });
    }

    // 2. Check if user already exists (by username OR email)
    let user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return res.status(400).json({ msg: 'User with this username or email already exists' });
    }

    // 3. Create new user (password will be hashed by the 'pre-save' hook)
    user = new User({
      username,
      email,
      password,
      role: role || 'developer'
    });
    
    await user.save();

    // 4. Create JWT
    const payload = { userId: user.id };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 5. Send back token and user info (excluding password)
    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// --- LOGIN ---
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Validate input
    if (!username || !password) {
      return res.status(400).json({ msg: 'Please provide username and password' });
    }

    // 2. Find user (by username OR email)
    // We use .select('+password') because we set 'select: false' in the schema
    const user = await User.findOne({
      $or: [{ username: username }, { email: username }]
    }).select('+password');

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 3. Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 4. Create JWT
    const payload = { userId: user.id };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 5. Send back token and user info
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

export default router;

