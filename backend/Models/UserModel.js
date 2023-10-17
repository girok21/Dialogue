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
        default: false
    },
    profilePicture: String,
    coverPicture: String,
    bio: String,
    followers: [String],
    following: [String],
    posts: [{_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    }, isShare : Boolean, createdAt: Date}],
    replies: [{reply: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reply",
    }, post: {
        type: mongoose.Schema.Types.ObjectId,
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