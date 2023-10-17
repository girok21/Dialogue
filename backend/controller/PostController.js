import mongoose from 'mongoose';
import PostModel from '../Models/PostModel.js';
import UserModel from '../Models/UserModel.js';
import ReplyModel from '../Models/ReplyModel.js';
import NotificationModel from '../Models/NotificationModel.js';

const objectId = mongoose.Types.ObjectId;

//@desc Create post
//@route POST/api/post/create
//@access Public

export const createPost = async(req, res) =>{
    const userId = req.params.id;
    const currentUser = await UserModel.findById(userId);
    const newPost = new PostModel({...req.body, user: userId});
    try {
        const createdPost = await newPost.save();
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {posts: [...currentUser.posts, {_id: createdPost._id, isShare: false, createdAt: Date.now()}]}, {new: true});
        res.status(200).json({message:`Post created`, createdPost, updatedUser} )
    } catch (error) {
        return res.status(500).send(`Error creating post: ${error.message}`);
    }
}

//@desc Create post
//@route POST/api/post/edit
//@access Public
export const editPost = async(req, res) => {
    const userId = new objectId(req.params.id);
    //always expects images array to be passed in
    const {postId, newText} = req.body;
    const {newImages} = req.body.newImages || [];
    try {
        const currentPost = await PostModel.findById(postId);
        if(!currentPost)//if Post doesn't exists
            return res.status(404).send("Post not found");
        if(!currentPost.user.equals(userId)){
            return res.status(500).send('Action Prohibited!')
        }
        const newPostData = {text: newText, images: newImages, lastEditedAt: Date.now()};
        const updatedPost = await PostModel.findByIdAndUpdate(postId, newPostData, {new: true});
        return res.status(200).json({message: 'Updated post', updatedPost});
    } catch (error) {
        return res.status(500).send(`Error: ${error.message}`);
    }
}

//@desc Delete post
//@route POST/api/post/delete
//@access Public

export const deletePost = async(req, res) => {
    const userId = new objectId(req.params.id);
    const currentUser = await UserModel.findById(userId);
    const { postId } = req.body;
    try {
        const currentPost = await PostModel.findById(postId);
        if(!currentPost.user.equals(userId)){
            return res.status(500).send('Action Prohibited!')
        }
        const deletedPost = await PostModel.findByIdAndDelete(postId);

        let updatedPostList = currentUser.posts
        updatedPostList.splice(currentUser.posts.indexOf(postId), 1);
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {posts: updatedPostList}, {new: true})
        return res.status(200).send({message: 'Post deleted successfully', deletedPost, updatedUser});
    } catch (error) {
        return res.status(500).send(`Error: ${error.message}`)
    }
}

//@desc Comment to post
//@route POST/api/post/add-comment
//@access Public

export const addPostComment = async (req, res) => {
    const userId = new objectId(req.params.id);
    const postId = new objectId(req.body.postId);
    try {
        //User who's commenting 
        const currentUser = await UserModel.findById(userId);
        //Post getting commented
        const currentPost = await PostModel.findById(postId);
        //Original user who posted
        const currentPostUser = await UserModel.findById(currentPost.user);
        const { text } = req.body;
        if(!currentUser || !currentPost){
            return res.status(404).send('Post or User not found');
        }
        const ReplyDataObject = {
            user: userId,
            post: postId,
            text
        }
        const currentRepliesList = currentUser.replies;
        const currentPostRepliesList = currentPost.comments;
        const newPostComment = await ReplyModel(ReplyDataObject);
        const savedPostComment = await newPostComment.save();
        //create a new notification to the orginal poster
        const newNotification = new NotificationModel({
            user: currentPostUser._id,
            type: 'post_commented',
            post: postId,
            relatedComment: savedPostComment._id,
            relatedUser: currentUser._id
        });
        const savedNotification = await newNotification.save();
        //notification list of the post's original user
        const notifications = [...currentPostUser.notifications, savedNotification._id];      
        const updatedCurrentUser = await UserModel.findByIdAndUpdate(userId, {replies: [...currentRepliesList, savedPostComment._id]}, {new: true});
        const updatedOriginalPoster = await UserModel.findByIdAndUpdate(currentPostUser._id, {notifications}, {new: true})
        const updatedCurrentPost = await PostModel.findByIdAndUpdate(postId, {comments: [...currentPostRepliesList, savedPostComment._id]}, {new: true});
        return res.status(200).json({message: 'Comment saved successfully', savedPostComment, updatedCurrentUser, updatedCurrentPost})
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
}

//@desc Reply to Comment
//@route POST/api/post/add-reply
//@access Public

export const addReplyComment = async (req, res) => {
    const userId = new objectId(req.params.id);
    const postId = new objectId(req.body.postId);
    const commentId = new objectId(req.body.commentId);
    try {
        const currentUser = await UserModel.findById(userId);
        const currentPost = await PostModel.findById(postId);
        const currentComment = await ReplyModel.findById(commentId);
        const { text } = req.body;
        if(!currentUser || !currentPost || !currentComment){
            return res.status(404).send('Post or User not found');
        }
        const ReplyDataObject = {
            user: userId,
            post: postId,
            comment: commentId,
            text
        }
        const currentRepliesList = currentUser.replies;
        const currentCommentRepliesList = currentComment.replies;
        const newCommentReply = await ReplyModel(ReplyDataObject);
        const savedCommentReply = await newCommentReply.save();
        const updatedCurrentUser = await UserModel.findByIdAndUpdate(userId, {replies: [...currentRepliesList, savedCommentReply._id]}, {new: true});
        const updatedCurrentComment = await ReplyModel.findByIdAndUpdate(commentId, {replies: [...currentCommentRepliesList, savedCommentReply._id]}, {new: true});
        return res.status(200).json({message: 'Comment saved successfully', savedCommentReply, updatedCurrentUser, updatedCurrentComment})
    } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
}

//@desc Like Post
//@route Put/api/post/like
//@access Public

export const likePost = async (req, res) => {
    const userId = new objectId(req.params.id);
    const postId = new objectId(req.body.postId);
    console.log(userId, postId);
    try {
        const currentUser = await UserModel.findById(userId);
        const currentPost = await PostModel.findById(postId);
        if(!currentUser || !currentPost){
            return res.status(404).send('Post or User not found');
        }
        let postLikeData = currentPost.likes;
        let message = '';
        //if user already present in likes list then we perform "Dislike" operation or we perform "Like" operation
        if(postLikeData.indexOf(userId) !== -1){//user already liked -> perform "Dislike"
            postLikeData.splice(postLikeData.indexOf(userId), 1);
            message = 'Post Disliked successfully';
        }
        else{ //user has not liked -> perform "Like"
            postLikeData = [...postLikeData, userId];
            message = 'Post Liked successfully';
        }
        const updatedCurrentPost = await PostModel.findByIdAndUpdate(postId, {likes: postLikeData}, {new: true});
        return res.status(200).json({message,updatedCurrentPost})
    } catch (error) {
        return res.status(500).send(`Error: ${error.message}`);
    }   
}

//@desc Share Post
//@route Put/api/post/like
//@access Public

export const sharePost = async (req, res) => {
    const userId = new objectId(req.params.id);
    const postId = new objectId(req.body.postId);
    console.log(userId, postId);
    try {
        const currentUser = await UserModel.findById(userId);
        const currentPost = await PostModel.findById(postId);
        if(!currentUser || !currentPost){
            return res.status(404).send('Post or User not found');
        }
        let postShareList = currentPost.shares;
        let message = '';
        //if user already present in share list then we perform "UnShare" operation or we perform "Share" operation
        if(postLikeData.indexOf(userId) !== -1){//user already liked -> perform "UnShare"
            postLikeData.splice(postLikeData.indexOf(userId), 1);
            message = 'Post UnShared successfully';
        }
        else{ //user has not liked -> perform "Like"
            postLikeData = [...postLikeData, userId];
            message = 'Post Shared successfully';
        }
        const updatedCurrentPost = await PostModel.findByIdAndUpdate(postId, {likes: postLikeData}, {new: true});
        return res.status(200).json({message,updatedCurrentPost})
    } catch (error) {
        return res.status(500).send(`Error: ${error.message}`);
    }   
}