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
    disabled: boolean;
}

export const Controls: React.FC<IControlsProps> =
    ({
        onPlayBackRateChange, onReverbWetChange, onReverbDecayChange, onReverbPreDelayChange,
        playbackRate, reverbWet, reverbDecay, reverbPreDelay,
        disabled
    }) => {
        return (
            <div className={styles['container']}>
                <pre className={styles['sub-title']}>C O N T R O L S</pre>

                <div className={styles['control-container']}>
                    <pre>Playback speed</pre>
                    <div className={styles['control']}>
                        <input
                            type="range"
                            min="0.6"
                            max="1"
                            step="0.05"
                            value={playbackRate}
                            onChange={(e) => onPlayBackRateChange(Number(e.target.value))}
                        />&nbsp;&nbsp;
                    <pre>{playbackRate}</pre>
                    </div>
                </div>

                <div className={styles['control-container']}>
                    <pre>Reverb</pre>
                    <div className={styles['control']}>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={reverbWet}
                            onChange={(e) => onReverbWetChange(Number(e.target.value))}
                        />&nbsp;&nbsp;
                    <pre>{reverbWet}</pre>
                    </div>
                </div>
                <div className={styles['control-container']}>
                    <pre>Decay</pre>
                    <div className={styles['control']}>
                        <input
                            type="range"
                            min="0.5"
                            max="10"
                            step="0.5"
                            value={reverbDecay}
                            onChange={(e) => onReverbDecayChange(Number(e.target.value))}
                        />&nbsp;&nbsp;
                    <pre>{reverbDecay}</pre>

                    </div>
                </div>
                <div className={styles['control-container']}>
                    <pre>Pre-delay</pre>
                    <div className={styles['control']}>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={reverbPreDelay}
                            onChange={(e) => onReverbPreDelayChange(Number(e.target.value))}
                        />&nbsp;&nbsp;
                    <pre>{reverbPreDelay}</pre>
                    </div>
                </div>
            </div>
        )
    }