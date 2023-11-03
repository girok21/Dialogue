import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    profilePicture: {
        type: String,
    },
    coverPicture: {
        type: String,
    },
    bio: {
        type: String,
        required: true,
        default: '',
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    posts: [{postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    }, isShare : {type: Boolean, default: false}, createdAt: Date}],
    replies: [{reply: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reply",
    }, post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Post",
    }}],
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification'
    }]
},
{timestamps: true}
);

const UserModel = mongoose.model('User', userSchema);
export default UserModel;