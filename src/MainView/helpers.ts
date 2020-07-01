import jsmediatags from "jsmediatags";

export interface ITrackMetaData {
    album?: string;
    artist?: string;
    title?: string;
    picture?: number[];
    length?: number;
}

export const getTrackMetaData = (url: string): Promise<ITrackMetaData> => {
    url = `http://localhost:3000${url}`;
    return new Promise((resolve, reject) => {
        jsmediatags.read(url, {
            onSuccess: (tag) => {
                resolve({
                    album: tag.tags.album,
                    artist: tag.tags.artist,
                    title: tag.tags.title,
                    picture: tag.tags.picture?.data
                });
            },
            onError: (error) => {
                reject(error);
            }
        });
    });
}