import React from 'react';
import styles from './Controls.module.css';

export interface IControlsProps {
    playbackRate: number;
    reverbWet: number;
    reverbDecay: number;
    reverbPreDelay: number;
    onPlayBackRateChange: (value: number) => void;
    onReverbWetChange: (value: number) => void;
    onReverbDecayChange: (value: number) => void;
    onReverbPreDelayChange: (value: number) => void;
}

export const Controls: React.FC<IControlsProps> =
    ({
        onPlayBackRateChange, onReverbWetChange, onReverbDecayChange, onReverbPreDelayChange,
        playbackRate, reverbWet, reverbDecay, reverbPreDelay,
    }) => {
        return (
            <div className={styles['container']}>
                <p className={styles['sub-title']}>C O N T R O L S</p>

                <div className={styles['control-container']}>
                    <label htmlFor="playbackSpeed">Playback speed</label>
                    <div className={styles['control']}>
                        <input
                            id="playbackSpeed"
                            type="range"
                            min="0.6"
                            max="1"
                            step="0.05"
                            value={playbackRate}
                            onChange={(e) => onPlayBackRateChange(Number(e.target.value))}
                        />
                        <span>{playbackRate}</span>
                    </div>
                </div>

                <div className={styles['control-container']}>
                    <label htmlFor="reverb">Reverb</label>
                    <div className={styles['control']}>
                        <input
                            id="reverb"
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={reverbWet}
                            onChange={(e) => onReverbWetChange(Number(e.target.value))}
                        />
                        <span>{reverbWet}</span>
                    </div>
                </div>
                <div className={styles['control-container']}>
                    <label htmlFor="decay">Decay</label>
                    <div className={styles['control']}>
                        <input
                            id="decay"
                            type="range"
                            min="0.5"
                            max="10"
                            step="0.5"
                            value={reverbDecay}
                            onChange={(e) => onReverbDecayChange(Number(e.target.value))}
                        />
                        <span>{reverbDecay}</span>
                    </div>
                </div>
                <div className={styles['control-container']}>
                    <label htmlFor="preDelay">Pre-delay</label>
                    <div className={styles['control']}>
                        <input
                            id="preDelay"
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={reverbPreDelay}
                            onChange={(e) => onReverbPreDelayChange(Number(e.target.value))}
                        />
                        <span>{reverbPreDelay}</span>
                    </div>
                </div>
            </div>
        )
    }