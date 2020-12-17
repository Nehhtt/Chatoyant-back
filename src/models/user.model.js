import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import validator from 'validator';

config();

const jwtPrivateSecret = process.env.JWT_PRIVATE_SECRET.replace(/\\n/g, '\n');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: [validator.isEmail, 'Please provide a valid email address'],
    required: [true, 'Email is required'],
    unique: true,

  },
  userName: {
    type: String,
    required: [true, 'userName is required'],
    unique: true,
  },
  googleId: String,
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: 8,
  },
});

userSchema.pre('save', async function validPassword(next) {
  if (!this.password || !this.isModified('password')) return next;

  this.password = await bcrypt.hash(
    this.password,
    // eslint-disable-next-line radix
    parseInt(process.env.HAS),
  );
  return next();
});

userSchema.methods.toJSON = function userToJSON() {
  const user = this;

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

userSchema.methods.comparePassword = async function comparePassword(password) {
  const value = await bcrypt.compare(password, this.password);
  return (value);
};

userSchema.methods.generateVerificationToken = function generateVerificationToken() {
  return jwt.sign({ id: this._id }, jwtPrivateSecret, {
    expiresIn: '10d',
    algorithm: 'RS256',
  });
};

userSchema.statics.checkExistingField = async (field, value) => {
  // eslint-disable-next-line no-use-before-define
  const checkField = await User.findOne({ [`${field}`]: value });

  return checkField;
};

const User = mongoose.model('User', userSchema);

export default User;
