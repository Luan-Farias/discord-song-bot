import mongoose from 'mongoose';

interface PostsInterface extends mongoose.Document {
    size: string,
    key: string,
    url: string,
    createdAt: string,
    name: string
}

const PostsSchema = new mongoose.Schema({
    name: String,
    size: String,
    key: String,
    url: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
});

export default mongoose.model<PostsInterface>('Post', PostsSchema);
