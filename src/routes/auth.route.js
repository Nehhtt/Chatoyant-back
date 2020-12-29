import { Router } from 'express';
import passport from 'passport';
import authController from '../controllers/auth.controller';
import catchAsync from '../middleware/catchAsync';
import authentication from '../middleware/authenticate';

const {
  signup, login, protectedRoute, socialAuth,
} = authController;
const { authenticate } = authentication;

const authRouter = Router();

authRouter.post('/signup', catchAsync(signup));
authRouter.post('/login', catchAsync(login));
authRouter.get(
  '/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  }),
);

// callback route for google
authRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  }),
  socialAuth,
);

authRouter.get('/access', authenticate, catchAsync(protectedRoute));

export default authRouter;
