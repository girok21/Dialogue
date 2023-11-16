import express from 'express';
import { getUserById, updateUser, deleteUser, followUnfollowUser, getUserNotifications, getUserByUsername, getMyFeed, getUserRelation, getUsersBySearch } from '../controller/UserController.js';
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router();

router.route('/').put( protect, updateUser)
                .delete(protect, deleteUser);
router.route('/profile/id/:id').get(protect, getUserById);
router.put('/follow/', protect, followUnfollowUser);
router.get('/profile/:username', getUserByUsername)
router.get('/myfeed', protect, getMyFeed);
router.get('/relation/:id', protect, getUserRelation);
router.get('/notifications', protect, getUserNotifications);
router.get('/search/:searchString', getUsersBySearch);


export default router;