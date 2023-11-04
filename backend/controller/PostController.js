import mongoose from 'mongoose';
import PostModel from '../Models/PostModel.js';
import UserModel from '../Models/UserModel.js';
import ReplyModel from '../Models/ReplyModel.js';
import NotificationModel from '../Models/NotificationModel.js';
import { v2 as cloudinary } from "cloudinary"

const objectId = mongoose.Types.ObjectId;

//@desc Create post
//@route POST/api/post/create
//@access Public

export const createPost = async(req, res) =>{
    const currentUser = req.user;
    let { image } = req.body;
    const text = req.body.text;
    let PostBody = {text};
    if(image){
        const uploadedResponse = await cloudinary.uploader.upload(image);
        image = uploadedResponse.secure_url;
        PostBody = { ...PostBody, images: [image] }
    }
    const userId = currentUser._id;
    const newPost = new PostModel({...PostBody, user: userId});
    try {
        const createdPost = await newPost.save();
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {posts: [...currentUser.posts, {postId: createdPost._id, isShare: false, createdAt: Date.now()}]}, {new: true});
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
    const currentUser = req.user;
    const { id:postId } = req.params;
    try {
        const userId = currentUser._id;
        const currentPost = await PostModel.findById(postId);
        if(!currentPost) throw new Error('Post not found');
        if(!currentPost.user.equals(userId)){
            throw new Error("Action prohbhited!");
        }
        const deletedPost = await PostModel.findByIdAndDelete(postId);

        let updatedPostList = currentUser.posts;
        updatedPostList.splice(currentUser.posts.indexOf(postId), 1);
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {posts: updatedPostList}, {new: true})
        return res.status(200).send({message: 'Post deleted!'});
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({message: error.message});
    }
}

//@desc Comment to post
//@route POST/api/post/add-comment
//@access Public

export const addPostComment = async (req, res) => {
    const postId = new objectId(req.params.postId);
    try {
        if(!postId || postId === ""){
            throw new Error("Invalid post id");
        }
        //User who's commenting 
        const currentUser = req.user;
        const userId = currentUser._id;
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
        const updatedCurrentUser = await UserModel.findByIdAndUpdate(userId, {replies: [...currentRepliesList, {reply: savedPostComment._id, post: postId}]}, {new: true});
        const updatedOriginalPoster = await UserModel.findByIdAndUpdate(currentPostUser._id, {notifications}, {new: true})
        const updatedCurrentPost = await PostModel.findByIdAndUpdate(postId, {comments: [...currentPostRepliesList, {_id: savedPostComment._id, userId: currentUser._id}]}, {new: true});
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
    if(!req.params.postId){
        return res.status(404).send({ message: 'Post Id not found' });
    }
    const {postId} = req.params;
    try {
        const currentUser = req.user;
        const userId = currentUser._id;
        const currentPost = await PostModel.findById(postId);
        if(!currentUser || !currentPost){
            return res.status(404).send('Post or User not found');
        }
        let postLikeData = currentPost.likes;
        let message = '';
        //if user already present in likes list then we perform "Dislike" operation or we perform "Like" operation
        if(postLikeData.indexOf(userId) !== -1){//user already liked -> perform "Dislike"
            postLikeData.splice(postLikeData.indexOf(userId), 1);
            message = 'disliked';
        }
        else{ //user has not liked -> perform "Like"
            postLikeData = [...postLikeData, userId];
            message = 'liked';
        }
        const updatedCurrentPost = await PostModel.findByIdAndUpdate(postId, {likes: postLikeData}, {new: true});
        return res.status(200).json({message, updatedCurrentPost})
    } catch (error) {
        return res.status(500).send(`Error: ${error.message}`);
    }   
}

//@desc Share Post
//@route Put/api/post/share/:postId
//@access Private

export const sharePost = async (req, res) => {
    const postId = new objectId(req.params.postId);
    const {action} = req.body;
    try {
        const currentUser = req.user;
        const currentPost = await PostModel.findById(postId);
        if(!currentUser || !currentPost){
            throw new Error('User/Post not found');
        }
        let postShareList = currentUser.posts;
        let shares = currentPost.shares;
        if(!postShareList){
            postShareList = [];
        }
        if(!shares){
            shares = [];
        }
        let message = '';
        //if action is remove 
        if(action === "remove"){
            let postIndex = postShareList.findIndex(post => post.isShare && post.postId.toString() === postId.toString());//find the corroesponding ID across all "shared" post
            //post need to be unshared
            if(postIndex !== -1)
                postShareList.splice(postIndex, 1);//Remove the original shared post from the array
            postIndex = shares.findIndex(user => user.toString() === currentUser._id.toString());
            if(postIndex !== -1)
                shares.splice(postIndex, 1);
            message = 'Removed!';
        }
        else if(action === "repost"){ //action equals repost
            let postIndex = postShareList.findIndex(post => post.isShare && post.postId.toString() === postId.toString());//find the corroesponding ID across all "shared" post
            if(postIndex === -1)
                postShareList.push({
                    postId: postId,
                    isShare: true,
                    createdAt: new Date()
                })
            postIndex = shares.findIndex(user => user.toString() === currentUser._id.toString());//find the corroesponding ID across all "shared" post
            if(postIndex === -1)
                shares = [...shares, currentUser._id]
            message = 'Reposted!';

        }else{
            throw new Error('Invalid action!!!')
        }
        const updatedCurrentPost = await PostModel.findByIdAndUpdate(postId, {shares}, {new: true});
        const updatedUser = await UserModel.findByIdAndUpdate(currentUser._id, {posts: postShareList}, {new: true});
        return res.status(200).json({message,updatedCurrentPost, updatedUser})
    } catch (error) {
        return res.status(500).send(`Error: ${error.message}`);
    }   
}

//@desc Get Post Comment by commnet Id
//@route GET/api/post/comment/:postId/:commentId
//@access Public

export const getPostComment = async(req, res) =>{
    try {
        const {commentId} = req.params;
        if(!commentId || commentId===""){
            throw new Error("Invalid reply id");
        }
        const commentObject = await ReplyModel.findById(commentId);
        if(!commentObject){
            throw new Error("Invalid reply id");
        }
        return res.status(200).send(commentObject);
    } catch (error) {
        return res.status(404).send({error: error.message});
    }
}