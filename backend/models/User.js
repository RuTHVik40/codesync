import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false // This will hide the password by default on queries
  },
  role: {
    type: String,
    required: true,
    default: 'developer',
    enum: ['developer', 'designer', 'manager', 'reviewer'] // Only allow these roles
  }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// --- Password Hashing Middleware ---
// This runs "pre" (before) a user document is "save"d
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Generate a "salt" to make the hash unique
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// --- Password Comparison Method ---
// This adds a custom method to all User documents
UserSchema.methods.comparePassword = function(candidatePassword) {
  // 'this.password' is the hashed password from the database
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;

