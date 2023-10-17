import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['user_following', 'post_liked', 'post_shared', 'post_commented'],
        required: true, 
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    relatedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    relatedComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply'
    }
});

const NotificationModel = mongoose.model('Notification', notificationSchema);

export default NotificationModel;