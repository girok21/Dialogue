import express from 'express';
import { addPostComment, createPost, deletePost, editPost, addReplyComment, likePost } from '../controller/PostController.js';

const router = express.Router();

router.post('/create/:id', createPost)
    .put('/edit/:id', editPost)
    .delete('/delete/:id', deletePost)
    .post('/add-comment/:id', addPostComment)
    .post('/add-reply/:id', addReplyComment)
    .put('/like/:id', likePost);

export default router;