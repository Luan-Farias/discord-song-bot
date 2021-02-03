interface SongInterface {
    type: string,
    callback: string,
    name: string
}

function createSong(): SongInterface {
    const song: SongInterface = {
        type: '',
        callback: '',
        name: ''
    };
    return song;
}

export default createSong;
