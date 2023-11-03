import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    lastEditedAt: Date,
    images: [String],
    shares: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        _id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reply'
        }, 
        userId:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        }}],
},{timestamps: true});

const PostModel = mongoose.model('Post', postSchema);
export default PostModel;