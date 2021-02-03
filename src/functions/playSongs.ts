import ytld from 'ytdl-core';
import path from 'path';

import client from '../discord.client';
import connectionModel from '@database/models/Connection';
import { VoiceConnection, StreamDispatcher } from 'discord.js';

interface SongInterface {
    type: string,
    callback: string
}

function playTypeBased(connection: VoiceConnection, song: SongInterface): StreamDispatcher {
    if (song.type === 'url') {
        const dispatcher = connection.play(
            ytld(song.callback, {
                filter: 'audioonly',
            })
        );
        return dispatcher;
    }
    if (song.type === 'default') {
        const dispatcher = connection.play(
            path.resolve(__dirname, '..', 'uploads', song.callback)
        );
        return dispatcher;
    }
}

async function playSongs(guild_id: string): Promise<void> {
    const connection = client.voice.connections.find((item, key) => key === guild_id);
    const connectionDatabase = await connectionModel.findOne({
        guild_id,
    });

    if (connectionDatabase.song) {
        const song = connectionDatabase.songs[connectionDatabase.current];
        const dispatcher = playTypeBased(connection, song);
        dispatcher.on('finish', () => playSongs(guild_id));
        return;
    }
    const song = connectionDatabase.songs[connectionDatabase.current + 1];

    if (!song && !connectionDatabase.queue) {
        connection.disconnect();
        return;
    }
    if (!song && connectionDatabase.queue) {
        connectionDatabase.current = 0;
        song.type = connectionDatabase.songs.slice(0, 1).shift().type;
        song.callback = connectionDatabase.songs.slice(0, 1).shift().callback;
    }
    if(!connectionDatabase.queue && connectionDatabase.current !== -1) {
        connectionDatabase.songs = connectionDatabase.songs.slice(1);
    }
    if (connectionDatabase.current === -1) {
        connectionDatabase.current++;
    }
    if(song && connectionDatabase.queue) {
        connectionDatabase.current++;
    }
    await connectionDatabase.save();

    const dispatcher = playTypeBased(connection, song);
    dispatcher.on('finish', () => playSongs(guild_id));
}

export default playSongs;
