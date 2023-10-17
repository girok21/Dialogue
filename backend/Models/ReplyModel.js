import mongoose from 'mongoose';

const ReplySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    comment:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reply"
    },
    text:{
        type: String,
        required: true,
    },
    likes: [String],
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reply",
    }]
},{timestamps: true});

const ReplyModel = mongoose.model('Reply', ReplySchema);
export default ReplyModel;