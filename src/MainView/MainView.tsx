import React, { useState, useEffect, useMemo, useCallback } from 'react';
import * as Tone from "tone";
import { Player } from './Player/Player';
import { Controls } from './Controls/Controls';

const TRACK_URL = `${process.env.PUBLIC_URL}/track.mp3`;

interface MainViewProps { }

export const MainView: React.FC<MainViewProps> = () => {

    const [loading, setLoading] = useState<boolean>(true);
    const [songInfo, setSongInfo] = useState({ length: 0 });
    const [currentPlayback, setCurrentPlayback] = useState<number>(0);
    let interval: NodeJS.Timeout;

    const onLoading = () => {
        setSongInfo(prev => ({ ...prev, length: player.buffer.duration }));
        setLoading(false);
    };
    const player = useMemo(() => new Tone.Player(TRACK_URL, onLoading).toDestination(), []);
    const reverb = useMemo(() => new Tone.Reverb().toMaster(), []);
    // const generateReverb = useCallback( () => reverb.generate().then(() => {
    //     // player.connect(reverb);
    //     reverb.wet.value = 0;
    // }), []);
    // generateReverb();


    const onPlay = () => {
        console.log(currentPlayback);
        player.start(0, currentPlayback);
        setIsPlaying(true);
    };
    const onStop = () => {
        player.stop();
        setIsPlaying(false);
    }
    const onPlaybackPositionChange = (value: number) => {
        player.stop();
        player.start(0, value);
        setCurrentPlayback(value);
    };
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentPlayback(prev => prev + 0.1);
            }, 100);
        } else {
            if (interval) clearInterval(interval);
        }
        return () => {
            clearInterval(interval);
            // player.dispose();
        };
    }, [isPlaying]);

    if (loading) {
        return <div>Loading...</div>
    }

    const onPlayBackRateChange = (value: number) => {
        player.playbackRate = value;
    }
    
    const onReverbChange = (value: number) => {
        reverb.wet.value = value;
    }

    return (
        <div style={{ margin: '25px' }}>
            <pre>A E S T H E T I C   S O N G S   G E N E R A T O R</pre>
            <div style={{ display: 'flex' }}>
                <div style={{ width: '30%' }}>
                    <Player
                        onPlay={onPlay}
                        onStop={onStop}
                        onPlaybackPositionChange={onPlaybackPositionChange}
                        currentPlayback={currentPlayback}
                        isPlaying={isPlaying}
                        songInfo={songInfo}
                    />
                </div>
                <div style={{ width: '30%', marginLeft: '100px' }}>
                    <Controls
                        player={player}
                        reverb={reverb}
                        onPlayBackRateChange={onPlayBackRateChange}
                        onReverbChange={onReverbChange}
                    />
                </div>
            </div>

        </div>
    )
};

    // const buffer = new Tone.Buffer(TRACK_URL, () => {
    //     const buff = buffer.get();
    //     console.log(buff);
    // }, (error) => {
    //     console.error(error);
    // });
    // play as soon as the buffer is loaded
    // player.autostart = true;