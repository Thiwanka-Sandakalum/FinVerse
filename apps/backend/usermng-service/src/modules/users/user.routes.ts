import { Router } from 'express';
import * as UserController from './user.controller';

const router = Router();
router.get('/', UserController.getUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);
router.post('/login-callback', UserController.loginCallback);

export default router;
