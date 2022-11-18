import {
  postUserSignUp,
  postUserSignIn,
} from '../controllers/user.controller.js';

import userExists from '../middlewares/userExists.middleware.js';

import { Router } from 'express';

const router = Router();

router.post('/sign-up', userExists, postUserSignUp);

router.post('/sign-in', userLoginValidation, postUserSignIn);

export default router;
