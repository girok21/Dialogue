import express from 'express';
import { addPostComment, createPost, deletePost, editPost, getPostComment, addReplyComment, likePost, sharePost } from '../controller/PostController.js';
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router();

router.post('/create', protect, createPost)
    .put('/edit/:postId', protect, editPost)
    .delete('/delete/:postId', protect, deletePost)
    .post('/add-comment/:postId', protect, addPostComment)
    .post('/add-reply/:postId', protect, addReplyComment)
    .put('/like/:postId', protect, likePost)
    .put('/share/:postId', protect, sharePost)
    .get('/comment/:commentId', protect, getPostComment)

export default router;