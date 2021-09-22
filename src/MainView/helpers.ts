import jsmediatags from "jsmediatags";

export interface ITrackMetaData {
    album: string;
    artist: string;
    title: string;
    picture?: number[];
    length: number;
}

export const DEFAULT_TRACK_METADATA: ITrackMetaData = {
    album: "Unknown album",
    artist: "Unknown Artist",
    title: "Unknown Song",
    length: 0
}

export const getTrackMetaData = (source: string | File): Promise<ITrackMetaData> => {
    if (typeof source === "string") {
        source = `http://localhost:3000${source}`;
    }
    return new Promise((resolve) => {
        jsmediatags.read(source, {
            onSuccess: (tag) => {
                resolve({
                    album: tag.tags.album || "Unknown album",
                    artist: tag.tags.artist || "Unknown Artist",
                    title: tag.tags.title || "Unknown Song",
                    picture: tag.tags.picture?.data,
                    length: 0
                });
            },
            onError: (error) => {
                console.error(`Error decoding song tags: ${error.info}`);
                resolve(Object.assign({}, DEFAULT_TRACK_METADATA));
            }
        });
    });
};

// const getRandomGif = () => {
//     const url = `${process.env.PUBLIC_URL}/go.wasm`;
//     WebAssembly.instantiateStreaming(fetch(url),)
// }