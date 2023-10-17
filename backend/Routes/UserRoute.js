import express from 'express';
import { getUserById, updateUser, deleteUser, followUser, unfollowUser } from '../controller/UserController.js';

const router = express.Router();

router.get('/:id', getUserById)
    .put('/:id', updateUser)
    .delete('/:id', deleteUser)
    .put('/follow/:id', followUser)
    .put('/unfollow/:id', unfollowUser);

export default router;