import UserModel from "../Models/UserModel.js";
import PostModel from "../Models/PostModel.js";
import NotificationModel from '../Models/NotificationModel.js';
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary"
const objectId = mongoose.Types.ObjectId;

//@desc Fetch user
//@route GET/api/user/:id
//@access Public

export const getUserById = async (req, res) => {
    const { id } = req.params;
    if(!id || id === "")    return;
    try {
        const userId = new objectId(id); 
        const userExists = await UserModel.findOne({ _id: userId }).select('-password')
        if(userExists) {
            res.status(200).json(userExists);
        }else{
            throw new Error('User does not exist');
        }
    } catch (error) {
        console.log(error)
    }
}

//@desc Fetch user by username
//@route GET/api/user/profile/:username
//@access Public

export const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const userExists = await UserModel.findOne({ username }).select('-password').select('-notifications');
        if(userExists){
        let sendingUser = userExists;
        let posts, replies = [];
        if(userExists.posts){
            const postsIdList = userExists.posts.map((post)=> post._id);
            posts = await PostModel.find({_id : {$in : postsIdList}}).sort({createdAt : -1});
            sendingUser = {...sendingUser, posts: posts}
        }
        if(userExists.replies){
            const repliesIdList = userExists.replies.map((post)=> post._id);
            replies = await PostModel.find({_id : {$in : repliesIdList}}).sort({createdAt : -1})
        }
            res.status(200).json({user: userExists, posts, replies});
        }else{
            throw new Error({message: 'User Not Found'});
        }
    } catch (error) {
        res.status(404).json(error);
    }
}


//@desc Update user data
//@route PUT/api/user/
//@access Private

export const updateUser = async (req, res) => {
    const { firstName, lastName, username, email, bio } = req.body;
    let { profilePicture, coverPicture } = req.body;
    const id = req.user._id;
    try {
        const user = req.user;
        let updatedData = { firstName, lastName, username, email, bio };
        if(profilePicture){
            if(user.profilePicture){
                await cloudinary.uploader.destroy(user.profilePicture.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(profilePicture);
            profilePicture = uploadedResponse.secure_url;
            updatedData = { ...updatedData, profilePicture }
        }
        if(coverPicture){
            if(user.coverPicture){
                await cloudinary.uploader.destroy(user.coverPicture.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(coverPicture);
            coverPicture = uploadedResponse.secure_url;
            updatedData = { ...updatedData, coverPicture }
        }
        const updatedUser = await UserModel.findByIdAndUpdate(id, updatedData, {new: true}).select('-password');
        return res.json({
            email: updatedUser.email,
            username: updatedUser.username,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            bio: updatedUser.bio,
            profilePicture: updatedUser.profilePicture,
            coverPicture: updatedUser.coverPicture
        });
    }catch (error) {
        res.status(error.http_code).json(error.message);
    }
}


//@desc Delete user
//@route DELETE/api/user
//@access Private

export const deleteUser = async (req, res) => {
    const { password } = req.body;
    try {
        const foundUser = req.user;
        if(!foundUser){
            return res.status(404).json("User Not Found!");
        }
        const passwordValidate = await bcrypt.compare(password, foundUser.password);
        const isAdminStatus = foundUser.isAdmin;
        if(passwordValidate || isAdminStatus){
            const deltedUser = await UserModel.findByIdAndDelete({ _id: id });
            return res.status(200).json({deltedUser,...{message : "User deleted successfully"}});
        }
    } catch (error) {
        return res.status(500).json(`Error: ${error.message}`);        
    }
    return res.status(500).json('Access Denied!')
}


//@desc Follow user
//@route PUT/api/user/follow/:id
//@access Public

export const followUnfollowUser = async(req, res) => {
    const { action } = req.body;
    if( action === 'follow'){
        const { username } = req.body;
        let currentUser, followingUser;
        try {
            // const currentUserId = objectId(req.body.currentUserId);
            currentUser = req.user;
            if(!currentUser){
                return res.status(404).json('Current user doesn\'t exist!!!');
            }
            followingUser = await UserModel.findOne( {username: username} ).select('-password');
            if(!followingUser){
                return res.status(404).json(`Username: ${username} does not exist!`);
            }     
        } catch (error) {
            return res.status(500).json(`Error: ${error.message}`);
        }
    
        if( currentUser._id === followingUser._id) {
            return res.status(403).json("Action Forbidden!")
        }else{
            try {
                let followingList = currentUser.following, followersList = followingUser.followers, notifications = followingUser.notifications;
                if(currentUser.following.indexOf(followingUser._id)===-1)
                    followingList = [...followingList, followingUser._id];
                if(followingUser.followers.indexOf(currentUser._id)===-1)
                    followersList = [...followersList, currentUser._id];
                //create a new notification which will be added to the notficication list of the followed user
                const newNotification = new NotificationModel({
                    user: followingUser._id,
                    type: 'user_following',
                    relatedUser: currentUser._id
                });
                const savedNotification = await newNotification.save();
                notifications = [...notifications, savedNotification._id];
                const CurrentUpdatedUser = await UserModel.findByIdAndUpdate(currentUser._id, {following: followingList}, {new: true});
                const FollowingUpdatedUser = await UserModel.findByIdAndUpdate(followingUser._id, {followers: followersList, notifications}, {new: true});
                return res.status(200).json({CurrentUpdatedUser, FollowingUpdatedUser, message: 'User Followed!'});
            } catch (error) {
                return res.status(500).json(`Error: ${error.message}`);
            }
        };    
    }else{
        const { username } = req.body;
        const currentUser = req.user;
        if(!currentUser){
            return res.status(404).json('Current user doesn\'t exist!!!');
        }
        const followingUser = await UserModel.findOne( {username: username} ).select('-password');
        if(!followingUser){
            return res.status(404).json(`Username: ${username} does not exist!`);
        }
        if( currentUser._id === followingUser._id) {
            return res.status(403).json("Action Forbidden!")
        }else{
            try {
                let followingList = currentUser.following,followersList = currentUser.followers;
                if(currentUser.following.indexOf(followingUser._id) !== -1){
                    followingList.splice(currentUser.following.indexOf(followingUser._id), 1);
                }
                if(followingUser.followers.indexOf(currentUser._id) !== -1){
                    followersList.splice(followingUser.followers.indexOf(currentUser._id), 1);
                }
                const CurrentUpdatedUser = await UserModel.findByIdAndUpdate(currentUser._id, {following: followingList}, {new: true});
                const FollowingUpdatedUser = await UserModel.findByIdAndUpdate(followingUser._id, {followers: followersList}, {new: true});
                return res.status(200).json({CurrentUpdatedUser, FollowingUpdatedUser, message: 'User Unfollowed!'});
            } catch (error) {
                return res.status(500).json(`Error: ${error.message}`);
            }
        };    
    }
}

//@desc Send user feed
//@route GET/api/user/myfeed
//@access Private

export const getMyFeed = async(req, res) =>{
    const user = req.user;
    //list of users who's posts should be shown in the feed (followers, following, currentuser)
    let usersArray = [user._id, ...user.following];
    usersArray = usersArray.map((userId)=>{return String(userId)});
    usersArray = [...(new Set(usersArray))];
    const usersList = usersArray.map((user)=>new objectId(user));
    // posts from the following users and current user
    try {
        let feedPosts=[];
        // const feedPosts = await PostModel.find({user : {$in : usersList}}).sort({createdAt : -1});
        // await Promise.all(usersList.map(async(user) => {
        //     const userPosts = await UserModel.findById(user).select("posts firstName lastName username");
        //     userPosts.posts.forEach(async(post) => {
        //         console.log(post.postId)
        //         const postObject = await PostModel.findById(post.postId);
        //         console.log(postObject)
        //         const author_fullName = userPosts.firstName + ' ' + userPosts.lastName;
        //         const isShare = post.isShare;
        //         const author_username = userPosts.username;
        
        //         // Create the object with the desired fields and push it to the feedPosts array
        //         feedPosts.push({
        //           post: postObject,
        //           author_name: author_fullName,
        //           username: author_username,
        //           isShare
        //          });
        //       });
        //     // feedPosts.push(userPosts);
        // }));
        await Promise.all(usersList.map(async (userId) => {
            const userPosts = await UserModel.findById(userId).select("posts firstName lastName username");
      
            for (const post of userPosts.posts) {
              const postObject = await PostModel.findById(post.postId);
              const author_fullName = userPosts.firstName + ' ' + userPosts.lastName;
              const isShare = post.isShare;
              const author_username = userPosts.username;
              const createdAt = post.createdAt;
      
              // Create the object with the desired fields and push it to the feedPosts array
              feedPosts.push({
                _id: post._id,
                post: postObject,
                author_name: author_fullName,
                username: author_username,
                createdAt,
                isShare
              });
            }
          }));
        feedPosts.sort((a, b) => b.createdAt - a.createdAt);
        return res.status(200).json({feedPosts});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Internal Server Error"});
    }
}

//@desc Get user relation with the given userId
//@route GET/api/user/:id/relation
//@access Private

export const getUserRelation = (req, res) => {
    const userId = req.params.id;
    const user = req.user;
    let self = false;
    if(userId.toString() === user._id.toString()){
        self = true;
    }
    const isFollowing = user.following.indexOf(userId) !== -1? true : false;
    const isFollower = user.followers.indexOf(userId) !== -1? true : false;
    return res.status(200).json({isFollowing, isFollower, self});
}