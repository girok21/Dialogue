import express from 'express';
import { addPostComment, createPost, getPostById, deletePost, editPost, getPostComment, addReplyComment, likePost, sharePost } from '../controller/PostController.js';
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router();

router.get('/by-id/:postId', getPostById)
    .post('/create', protect, createPost)
    .put('/edit/:postId', protect, editPost)
    .delete('/delete/:postId', protect, deletePost)
    .post('/add-comment/:postId', protect, addPostComment)
    .post('/add-reply/:postId', protect, addReplyComment)
    .put('/like/:postId', protect, likePost)
    .put('/share/:postId', protect, sharePost)
    .get('/comment/:commentId', getPostComment)

export default router;