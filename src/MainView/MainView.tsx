import React, { useState, useEffect, useMemo } from 'react';
import * as Tone from "tone";
import { Player } from './Player/Player';
import { Controls } from './Controls/Controls';

const TRACK_URL = `${process.env.PUBLIC_URL}/track.mp3`;

const defaultValues = {
    playBackRate: 0.8,
    reverbWet: 0.5,
    reverbDecay: 0.5
};

interface MainViewProps { }

export const MainView: React.FC<MainViewProps> = () => {

    const [loading, setLoading] = useState<boolean>(true);
    const [songInfo, setSongInfo] = useState({ length: 0 });
    const [currentPlayback, setCurrentPlayback] = useState<number>(0);

    const [playbackRate, setPlaybackRate] = useState<number>(defaultValues.playBackRate);
    const [reverbWet, setReverbWet] = useState<number>(defaultValues.reverbWet);
    const [reverbDecay, setReverbDecay] = useState<number>(defaultValues.reverbDecay);

    const reverb = useMemo(() => new Tone.Reverb(), []);
    const player = useMemo(() => new Tone.Player(), []);
    let interval: NodeJS.Timeout;

    const onLoading = () => {
        setSongInfo(prev => ({ ...prev, length: player.buffer.duration }));
        setLoading(false);
    };

    useEffect(() => {
        const p1 = reverb.generate();
        const p2 = player.load(TRACK_URL);
        Promise.all([p1, p2]).then(() => {
            player.playbackRate = defaultValues.playBackRate;
            reverb.wet.value = defaultValues.reverbWet;
            reverb.toDestination();
            player.connect(reverb);
            onLoading();
            console.log("done");
        });
    }, []);

    const onPlay = () => {
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
        // if (isPlaying) {
        //     interval = setInterval(() => {
        //         setCurrentPlayback(prev => prev + 0.1);
        //     }, 100);
        // } else {
        //     if (interval) clearInterval(interval);
        // }
        // return () => {
        //     clearInterval(interval);
        //     // player.dispose();
        // };
    }, [isPlaying]);

    const onPlayBackRateChange = (value: number) => {
        player.playbackRate = value;
        setPlaybackRate(value);
    }

    const onReverbWetChange = (value: number) => {
        reverb.wet.value = value;
        setReverbWet(value);
    }

    const onReverbDecayChange = (value: number) => {
        reverb.decay = value;
        setReverbDecay(value);
    }

    if (loading) {
        return <div>Loading...</div>
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
                        disabled={!isPlaying}
                        playbackRate={playbackRate}
                        reverbWet={reverbWet}
                        reverbDecay={reverbDecay}
                        onPlayBackRateChange={onPlayBackRateChange}
                        onReverbWetChange={onReverbWetChange}
                        onReverbDecayChange={onReverbDecayChange}
                    />
                </div>
            </div>

        </div>
    );
};

    // const buffer = new Tone.Buffer(TRACK_URL, () => {
    //     const buff = buffer.get();
    //     console.log(buff);
    // }, (error) => {
    //     console.error(error);
    // });
    // play as soon as the buffer is loaded
    // player.autostart = true;