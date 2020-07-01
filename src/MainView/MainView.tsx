import React, { useState, useEffect, useMemo } from 'react';
import * as Tone from "tone";
import { Player } from './Player/Player';
import { Controls } from './Controls/Controls';
import debounce from 'lodash.debounce';
import audioBufferToWav from 'audiobuffer-to-wav';
import { getTrackMetaData, ITrackMetaData } from './helpers';

function _updateReverbDecay(reverb: Tone.Reverb, value: number) { reverb.decay = value };
function _updateReverbPreDelay(reverb: Tone.Reverb, value: number) { reverb.preDelay = value };
const updateReverbDecay = debounce(_updateReverbDecay, 500);
const updateReverbPreDelay = debounce(_updateReverbPreDelay, 500);

const TRACK_URL = `${process.env.PUBLIC_URL}/track.mp3`;

const defaultValues = {
    playBackRate: 0.8,
    reverbWet: 1,
    reverbDecay: 10,
    reverbPreDelay: 0.1
};

interface MainViewProps { }

export const MainView: React.FC<MainViewProps> = () => {

    const [loading, setLoading] = useState<boolean>(true);
    const [songInfo, setSongInfo] = useState<ITrackMetaData>({ length: 0 });
    const [currentPlayback, setCurrentPlayback] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [downloadURL, setDownloadURL] = useState<string | undefined>();
    const [preparingDownload, setPreparingDownload] = useState<boolean>(false);

    const [playbackRate, setPlaybackRate] = useState<number>(defaultValues.playBackRate);
    const [reverbWet, setReverbWet] = useState<number>(defaultValues.reverbWet);
    const [reverbDecay, setReverbDecay] = useState<number>(defaultValues.reverbDecay);
    const [reverbPreDelay, setReverbPreDelay] = useState<number>(defaultValues.reverbPreDelay);

    const reverb = useMemo(() => new Tone.Reverb(), []);
    const player = useMemo(() => new Tone.Player(), []);
    let interval: NodeJS.Timeout;

    const onLoading = async () => {
        const trackMetadata = await getTrackMetaData(TRACK_URL);
        setSongInfo({ ...trackMetadata, length: player.buffer.duration });
        setLoading(false);
    };

    useEffect(() => {
        const p1 = reverb.generate();
        const p2 = player.load(TRACK_URL);
        Promise.all([p1, p2]).then(() => {
            player.playbackRate = defaultValues.playBackRate;
            reverb.wet.value = defaultValues.reverbWet;
            reverb.decay = defaultValues.reverbDecay;
            reverb.toDestination();
            player.connect(reverb);
            onLoading();
        });
        return () => {
            if (downloadURL) window.URL.revokeObjectURL(downloadURL);
        }
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
        updateReverbDecay(reverb, value);
        setReverbDecay(value);
    }
    const onReverbPreDelayChange = (value: number) => {
        updateReverbPreDelay(reverb, value);
        setReverbPreDelay(value);
    }

    const onSave = () => {
        setPreparingDownload(true);
        const duration = player.buffer.duration + ((1 - playbackRate) * player.buffer.duration);
        const offlineContext = new Tone.OfflineContext(2, duration, 44100);
        Tone.setContext(offlineContext);
        const _reverb = new Tone.Reverb();
        const _player = new Tone.Player();
        const p1 = _reverb.generate();
        const p2 = _player.load(TRACK_URL);
        Promise.all([p1, p2]).then(async () => {
            _reverb.wet.value = reverbWet;
            _reverb.decay = reverbDecay;
            _reverb.preDelay = reverbPreDelay;
            _player.playbackRate = playbackRate;
            _player.connect(_reverb);
            _reverb.toMaster();
            _player.start(0);
            const buffer = await offlineContext.render(false);
            const realBuffer = buffer.get();
            if (!realBuffer) {
                console.error("Error getting the buffer of the Audio Context");
                return;
            }
            const wavBuffer = audioBufferToWav(realBuffer);
            const blob = new Blob([wavBuffer], { type: "audio/wav" });
            const url = window.URL.createObjectURL(blob);
            setDownloadURL(url);
            setPreparingDownload(false);
        });
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
                        reverbPreDelay={reverbPreDelay}
                        onPlayBackRateChange={onPlayBackRateChange}
                        onReverbWetChange={onReverbWetChange}
                        onReverbDecayChange={onReverbDecayChange}
                        onReverbPreDelayChange={onReverbPreDelayChange}
                    />
                    <button style={{marginBottom: '20px'}} disabled={preparingDownload} onClick={onSave}>Save</button>
                    {
                        Boolean(downloadURL) && !preparingDownload ?
                            <audio id="finalTrack" src={downloadURL} controls={true}></audio>
                        : (preparingDownload) ?
                            <div>Loading...</div>
                        : null
                    }
                </div>
            </div>
        </div>
    );
};
