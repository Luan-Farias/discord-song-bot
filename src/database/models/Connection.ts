import mongoose, { Document } from 'mongoose';

interface SongInterface {
    type: string,
    callback: string,
    name: string
}

interface ConnectionInterface extends Document {
    guild_id: string,
    songs:  SongInterface[],
    current: number,
    queue: boolean,
    song: boolean,
}

const ConnectionsSchema = new mongoose.Schema({
    guild_id: String,
    songs: {
        type: Array,
    },
    current: Number,
    queue: Boolean,
    song: Boolean,
});

export default mongoose.model<ConnectionInterface>('Connection', ConnectionsSchema);
