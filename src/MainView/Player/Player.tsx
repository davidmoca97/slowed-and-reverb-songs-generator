import React from 'react';
import styles from './Player.module.css';
import { ITrackMetaData } from '../helpers';
import { Button } from '../Button/Button';

interface IPlayerProps {
    onPlay: Function;
    onStop: Function;
    onSongOver: Function;
    onPlaybackPositionChange: (value: number) => void;
    isPlaying: boolean;
    currentPlayback: number;
    songInfo?: ITrackMetaData;
}

export const Player: React.FC<IPlayerProps> = 
    ({ onPlay, onStop, currentPlayback, songInfo, isPlaying, onSongOver, onPlaybackPositionChange }) => {

    if (currentPlayback > (songInfo?.length || 0)) {
        onSongOver();
    }

    return (
        <div className={styles['container']}>
            <img className={styles['cover-art']}
                src="https://images.genius.com/8b5aa2421162cc34e69f8bd18a8b69c0.1000x1000x1.jpg" />
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
