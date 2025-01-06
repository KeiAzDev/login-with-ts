import express, { Router, Request, Response } from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshToken,
  isAuthenticated,
  home
} from '../controllers/authController';

const router: Router = express.Router();

router.post('/register', registerUser as express.RequestHandler);
router.post('/login', loginUser as express.RequestHandler);
router.post('/logout', logoutUser as express.RequestHandler);
router.get('/current-user', getCurrentUser as express.RequestHandler);
router.post('/refresh-token', refreshToken as express.RequestHandler);
router.get('/is-authenticated', isAuthenticated as express.RequestHandler);
router.get('/home', home as express.RequestHandler);

export default router;