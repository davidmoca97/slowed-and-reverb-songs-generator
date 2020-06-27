import React from 'react';
import * as Tone from 'tone';

export interface IControlsProps {
    player: Tone.Player;
    reverb: Tone.Reverb;
    onPlayBackRateChange: (value: number) => void;
    onReverbChange: (value: number) => void;
}

export const Controls: React.FC<IControlsProps> =
    ({ onPlayBackRateChange, onReverbChange, player, reverb }) => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <pre>C O N T R O L S</pre>

                <div style={{ display: 'flex' }}>
                    <pre>Playback speed</pre>&nbsp;
                     <input
                        type="range"
                        min="0.6"
                        max="1"
                        step="0.05"
                        value={player.playbackRate}
                        onChange={(e) => onPlayBackRateChange(Number(e.target.value))}
                    />&nbsp;&nbsp;
                    <pre>{player.playbackRate}</pre>
                </div>

                <div style={{ display: 'flex' }}>
                    <pre>Reverb</pre>&nbsp;
                     <input
                        type="range"
                        min="0.6"
                        max="1"
                        step="0.05"
                        value={reverb.wet.value}
                        onChange={(e) => onReverbChange(Number(e.target.value))}
                    />&nbsp;&nbsp;
                    <pre>{reverb.wet.value}</pre>
                </div>
            </div>
        )
    }