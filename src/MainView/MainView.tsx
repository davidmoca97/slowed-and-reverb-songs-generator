import React, { useState, useEffect, useMemo } from 'react';
import * as Tone from "tone";
import { Player } from './Player/Player';
import { Controls } from './Controls/Controls';
import debounce from 'lodash.debounce';
import audioBufferToWav from 'audiobuffer-to-wav';
import { DEFAULT_TRACK_METADATA, getTrackMetaData, ITrackMetaData } from './helpers';
import { Button } from './Button/Button';
import styles from './MainView.module.css';

function _updateReverbDecay(reverb: Tone.Reverb, value: number) { reverb.decay = value };
function _updateReverbPreDelay(reverb: Tone.Reverb, value: number) { reverb.preDelay = value };
const updateReverbDecay = debounce(_updateReverbDecay, 500);
const updateReverbPreDelay = debounce(_updateReverbPreDelay, 500);

const TRACK_URL = `${process.env.PUBLIC_URL}/track2.mp3`;

const defaultValues = {
    playBackRate: 0.8,
    reverbWet: 0.6,
    reverbDecay: 6,
    reverbPreDelay: 0.1
};

const getSongLength = (bufferDuration: number, playbackRate: number) => {
    return bufferDuration / playbackRate;
}

interface MainViewProps { }

export const MainView: React.FC<MainViewProps> = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [songInfo, setSongInfo] = useState<ITrackMetaData>(DEFAULT_TRACK_METADATA);
    const [currentPlayback, setCurrentPlayback] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [downloadURL, setDownloadURL] = useState<string | undefined>();
    const [preparingDownload, setPreparingDownload] = useState<boolean>(false);
    const [uploadedFile, setUploadedFile] = useState<{ file: File, objectURL: string } | undefined>();

    // Controls
    const [playbackRate, setPlaybackRate] = useState<number>(defaultValues.playBackRate);
    const [reverbWet, setReverbWet] = useState<number>(defaultValues.reverbWet);
    const [reverbDecay, setReverbDecay] = useState<number>(defaultValues.reverbDecay);
    const [reverbPreDelay, setReverbPreDelay] = useState<number>(defaultValues.reverbPreDelay);

    const reverb = useMemo(() => new Tone.Reverb(), []);
    const player = useMemo(() => new Tone.Player(), []);
    let interval: NodeJS.Timeout;

    const onLoading = async (trackUrl: string, file?: File) => {
        const trackMetadata = await getTrackMetaData(file || trackUrl);
        setSongInfo({ ...trackMetadata, length: getSongLength(player.buffer.duration, playbackRate) });
        setLoading(false);
    };

    const onInit = (trackUrl: string = TRACK_URL, file?: File) => {
        const p1 = reverb.generate();
        const p2 = player.load(trackUrl);
        Promise.all([p1, p2]).then(() => {
            player.playbackRate = defaultValues.playBackRate;
            reverb.wet.value = defaultValues.reverbWet;
            reverb.decay = defaultValues.reverbDecay;
            reverb.toDestination();
            player.connect(reverb);
            onLoading(trackUrl, file);
        });
    };

    useEffect(() => {
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
        player.start(0, value * playbackRate);
        setCurrentPlayback(value);
    };
    const onSongOver = () => {
        player.stop();
        setIsPlaying(false);
        setCurrentPlayback(0);
    }

    useEffect(() => {
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentPlayback(prev => prev + 1);
            }, 1000);
        } else {
            if (interval) clearInterval(interval);
        }
        return () => {
            clearInterval(interval);
        };
    }, [isPlaying]);

    const onPlayBackRateChange = (newPlayBackRate: number) => {
        const newSongLength = getSongLength(player.buffer.duration, newPlayBackRate);
        const previousSongLength = songInfo.length;
        player.playbackRate = newPlayBackRate;
        setPlaybackRate(newPlayBackRate);
        setSongInfo(currentValue => ({ ...currentValue, length: newSongLength }));
        setCurrentPlayback(currentPlaybackPosition => {
            return (newSongLength * currentPlaybackPosition) / (previousSongLength);
        });
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
        if (downloadURL) {
            window.URL.revokeObjectURL(downloadURL);
            setDownloadURL(undefined);
        }
        setPreparingDownload(true);
        const duration = getSongLength(player.buffer.duration, playbackRate);
        const offlineContext = new Tone.OfflineContext(2, duration, 44100);
        Tone.setContext(offlineContext);
        const _reverb = new Tone.Reverb();
        const _player = new Tone.Player();
        const p1 = _reverb.generate();
        const p2 = _player.load(uploadedFile?.objectURL as string);
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
            const url = URL.createObjectURL(blob);
            downloadFile(url);
            setDownloadURL(url);
            setPreparingDownload(false);
        });
    }

    const downloadFile = (url: string): void => {
        const link = document.createElement("a");
        link.href = url;
        link.download = 'reverb-song.wav';
        document.body.appendChild(link);
        link.dispatchEvent(
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            })
        );
        document.body.removeChild(link);
    }

    const onFileDropped = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) {
            return;
        }
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            const url = event.target?.result;
            if (!url || typeof url !== "string") {
                console.error("Couldn't load the file");
                return;
            }
            setUploadedFile({ file, objectURL: url });
            onInit(url, file);
        });
        setLoading(true);
        reader.readAsDataURL(file);
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (!player.loaded) {
        return (
            <input name="song-input" type="file" accept="audio/mp3" onChange={onFileDropped} />
        );
    }

    return (
        <div id="container" className={styles['container']}>
            <div className={styles['player-wrapper']}>
                <Player
                    onPlay={onPlay}
                    onStop={onStop}
                    onSongOver={onSongOver}
                    onPlaybackPositionChange={onPlaybackPositionChange}
                    currentPlayback={currentPlayback}
                    isPlaying={isPlaying}
                    songInfo={songInfo}
                />
            </div>
            <div className={styles['controls-wrapper']}>
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
                <Button fullWidth disabled={preparingDownload} onClick={onSave}>Save & Download</Button>
                {
                    Boolean(downloadURL) && !preparingDownload ?
                        <audio id="finalTrack" src={downloadURL}></audio>
                        : (preparingDownload) ?
                            <div>Loading...</div>
                            : null
                }
            </div>
        </div>
    );
};
