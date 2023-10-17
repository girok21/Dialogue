import UserModel from "../Models/UserModel.js";
import NotificationModel from '../Models/NotificationModel.js';
import bcrypt from "bcrypt";
import mongoose from "mongoose";
const objectId = mongoose.Types.ObjectId;

//@desc Fetch user
//@route GET/api/user/:id
//@access Public

export const getUserById = async (req, res) => {
    const { id } = req.params;
    const userExists = await UserModel.findOne({ _id: id }).select('-password')
    if(userExists) {
        res.status(200).json(userExists);
    }else{
        res.status(404).send("User not found");
    }
}

//@desc Fetch user
//@route PUT/api/user/:id
//@access Public

export const updateUser = async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body.updatedData;
    const { currentUserId, currentUserAdminStatus, password } = req.body;
    if(id === currentUserId || currentUserAdminStatus){
        try {
            const foundUser = await UserModel.findById({ _id: id });
            const passwordCheck = await bcrypt.compare(password, foundUser.password);
            if(foundUser && passwordCheck){
                //look if user wants to change password
                if(updatedData.password && updatedData.password !== ""){
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(password, salt);
                    updatedData = [...updatedData, ...{password : hashedPassword}];
                }
                const user = await UserModel.findByIdAndUpdate(id, updatedData, {new: true});
                res.status(200).json(user);
            }
        } catch (error) {
            res.status(500).json(error.message);
        }
    }else{
        res.status(404).json("Access Denied!")
    }
}


//@desc Delete user
//@route DELETE/api/user/:id
//@access Public

export const deleteUser = async (req, res) => {
    const id = req.params.id;
    const { currentUserId, currentUserAdminStatus, password } = req.body;
    if(currentUserAdminStatus || currentUserId === id){
        try {
            const foundUser = await UserModel.findById({ _id: id });
            if(!foundUser){
                return res.status(404).json("User Not Found!");
            }
            const passwordValidate = await bcrypt.compare(password, foundUser.password);
            if(passwordValidate){
                const deltedUser = await UserModel.findByIdAndDelete({ _id: id });
                return res.status(200).json({deltedUser,...{message : "User deleted successfully"}});
            }
        } catch (error) {
            return res.status(500).json(`Error: ${error.message}`);
            
        }
    }
    return res.status(500).json('Access Denied!')
}


//@desc Follow user
//@route PUT/api/user/follow/:id
//@access Public

export const followUser = async(req, res) => {
    const id = new objectId(req.params.id);
    const { followingUserName, currentUserId } = req.body;
    let currentUser, followingUser;
    try {
        // const currentUserId = objectId(req.body.currentUserId);
        currentUser = await UserModel.findOne({_id: currentUserId}).select('-password');
        if(!currentUser){
            return res.status(404).json('Current user doesn\'t exist!!!');
        }
        followingUser = await UserModel.findOne( {username: followingUserName} ).select('-password');
        if(!followingUser){
            return res.status(404).json(`Username: ${followingUserName} does not exist!`);
        }     
    } catch (error) {
        return res.status(500).json(`Error: ${error.message}`);
    }

    if( currentUser._id === followingUser._id) {
        return res.status(403).json("Action Forbidden!")
    }else{
        try {
            let followingList = currentUser.following, followersList = followingUser.followers, notifications = followingUser.notifications;
            if(currentUser.following.indexOf(followingUserName)===-1)
                followingList = [...followingList, followingUserName];
            if(followingUser.followers.indexOf(currentUser.username)===-1)
                followersList = [...followersList, currentUser.username];
            //create a new notification which will be added to the notficication list of the followed user
            const newNotification = new NotificationModel({
                user: followingUser._id,
                type: 'user_following',
                relatedUser: currentUser._id
            });
            const savedNotification = await newNotification.save();
            notifications = [...notifications, savedNotification._id];
            const CurrentUpdatedUser = await UserModel.findByIdAndUpdate(currentUserId, {following: followingList}, {new: true});
            const FollowingUpdatedUser = await UserModel.findByIdAndUpdate(followingUser._id, {followers: followersList, notifications}, {new: true});
            return res.status(200).json({CurrentUpdatedUser, FollowingUpdatedUser, message: 'User followed successfully'});
        } catch (error) {
            return res.status(500).json(`Error: ${error.message}`);
        }
    };
}

//@desc Unfollow user
//@route PUT/api/user/unfollow/:id
//@access Public
export const unfollowUser = async (req, res) => {
    const id = new objectId(req.params.id);
    const { currentUserId, followingUserName } = req.body;
    const currentUser = await UserModel.findById(currentUserId).select('-password');
    if(!currentUser){
        return res.status(404).json('Current user doesn\'t exist!!!');
    }
    const followingUser = await UserModel.findOne( {username: followingUserName} ).select('-password');
    if(!followingUser){
        return res.status(404).json(`Username: ${followingUserName} does not exist!`);
    }
    if( currentUser._id === followingUser._id) {
        return res.status(403).json("Action Forbidden!")
    }else{
        try {
            let followingList = currentUser.following,followersList = currentUser.followers;
            if(currentUser.following.indexOf(followingUser.username) !== -1){
                followingList.splice(currentUser.following.indexOf(followingUser.username), 1);
            }
            if(followingUser.followers.indexOf(currentUser.username) !== -1){
                followersList.splice(followingUser.followers.indexOf(currentUser.username), 1);
            }
            const CurrentUpdatedUser = await UserModel.findByIdAndUpdate(currentUserId, {following: followingList}, {new: true});
            const FollowingUpdatedUser = await UserModel.findByIdAndUpdate(followingUser._id, {followers: followersList}, {new: true});
            return res.status(200).json({CurrentUpdatedUser, FollowingUpdatedUser, message: 'User unfollowed successfully'});
        } catch (error) {
            return res.status(500).json(`Error: ${error.message}`);
        }
    };

}