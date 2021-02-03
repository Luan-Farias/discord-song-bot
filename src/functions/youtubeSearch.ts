import createSong from './createSong';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const youtubesearchapi = require('youtube-search-api');

interface SongInterface {
    type: string,
    callback: string,
    name: string
}


async function youtubeSearch(keyword: string): Promise<SongInterface> {
    const response = (await youtubesearchapi.GetListByKeyword(keyword)).items.shift();

    const youtubeSong = createSong();
    youtubeSong.type = 'url';
    youtubeSong.callback = `https://youtube.com/watch?v=${response.id}`;
    youtubeSong.name = response.title;

    return youtubeSong;
}

export default youtubeSearch;
