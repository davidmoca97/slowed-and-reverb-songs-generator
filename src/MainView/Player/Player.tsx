import React, { useMemo } from 'react';
import styles from './Player.module.css';
import { Button } from '../Button/Button';
import { TrackMetadata } from '../helpers/trackMetadata';
import { CoverArt } from './CoverArt';

interface IPlayerProps {
    onPlay: Function;
    onStop: Function;
    onSongOver: Function;
    onPlaybackPositionChange: (value: number) => void;
    isPlaying: boolean;
    currentPlayback: number;
    songInfo?: TrackMetadata;
}

export const Player: React.FC<IPlayerProps> =
    ({ onPlay, onStop, currentPlayback, songInfo, isPlaying, onSongOver, onPlaybackPositionChange }) => {

        if (currentPlayback > (songInfo?.length || 0)) {
            onSongOver();
        }

        const coverArt = useMemo(() => {
            return getCoverArtSrc(songInfo?.picture)
        }, [songInfo?.length]);

        return (
            <div className={styles['container']}>
                <CoverArt src={coverArt} />
                <div className={styles['playback']}>
                    <input type="range"
                        min={0}
                        step={1}
                        disabled={!isPlaying}
                        max={songInfo?.length}
                        value={currentPlayback}
                        className={styles['playback-input']}
                        onChange={(e) => onPlaybackPositionChange(Number(e.target.value))}
                    />
                </div>
                <div className={styles['track-info']}>
                    <div>{songInfo?.title}</div>
                    <div>{songInfo?.artist}</div>
                </div>
                <div className={styles['controls']}>
                    <Button onClick={() => onPlay()}>Play</Button>&nbsp;
                    <Button onClick={() => onStop()}>Stop</Button>
                </div>
            </div>
        )
    }


export function getCoverArtSrc(picture: TrackMetadata["picture"]): string | undefined {
    if (!picture) {
        return undefined;
    }
    try {
        const { data, format } = picture;
        if (!format || data.length === 0) {
            return undefined;
        }
        let base64String = "";
        for (let i = 0; i < data.length; i++) {
            base64String += String.fromCharCode(data[i]);
        }
        return `data:${format};base64,${window.btoa(base64String)}`;
    } catch (e) {
        return undefined;
    }
}