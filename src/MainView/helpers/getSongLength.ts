/**
 * Returns the correct length of the song
 * @param bufferDuration - Normal duration of the song in seconds
 * @param playbackRate - The current playback rate
 */
export const getSongLength = (bufferDuration: number, playbackRate: number) => {
    return bufferDuration / playbackRate;
}
