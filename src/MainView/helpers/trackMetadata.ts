import jsmediatags from "jsmediatags";
import { PictureType } from "jsmediatags/types";

export type TrackMetadata = {
    album: string;
    artist: string;
    title: string;
    picture?: PictureType;
    length: number;
}

export const DEFAULT_TRACK_METADATA: TrackMetadata = {
    album: "Unknown album",
    artist: "Unknown Artist",
    title: "Unknown Song",
    length: 0
}

/**
 * Gets track info directly from a file.
 * @param source - File
 */
export const getTrackMetaData = (source: File): Promise<TrackMetadata> => {
    return new Promise((resolve) => {
        jsmediatags.read(source, {
            onSuccess: (tag) => {
                resolve({
                    album: tag.tags.album || "Unknown album",
                    artist: tag.tags.artist || "Unknown Artist",
                    title: tag.tags.title || "Unknown Song",
                    picture: tag.tags.picture,
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
