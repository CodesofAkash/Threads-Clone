import mongoose from 'mongoose';

const postSchema =  mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
    },
    img: {
        type: String,
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    replies: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            text: {
                type: String,
                required: true,
            },
            username: {
                type: String,
                required: true,
            },
            profilePic: {
                type: String,
            },
        }
    ]
}, {
    timestamps: true,
})

const Post = mongoose.model('Post', postSchema);
export default Post;