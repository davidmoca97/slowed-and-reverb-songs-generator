import React, { useEffect, useState } from 'react';
import styles from './Player.module.css';

interface IPlayerProps {
    onPlay: Function;
    onStop: Function;
    onPlaybackPositionChange: (value: number) => void;
    isPlaying: boolean;
    currentPlayback: number;
    songInfo?: {
        name?: string;
        artist?: string;
        length?: number;
    }
}

export const Player: React.FC<IPlayerProps> = ({ onPlay, onStop, onPlaybackPositionChange, currentPlayback, songInfo, isPlaying }) => {

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
                <div>Happiness is a butterfly</div>
                <div>Lana del Rey</div>
            </div>
            <div className={styles['controls']}>
                <button onClick={() => onPlay()}>Play</button>&nbsp;
                <button onClick={() => onStop()}>Stop</button>
            </div>
        </div>
    )
}
