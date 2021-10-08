import React, { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import * as Tone from "tone";

import { Player } from './Player/Player';
import { Controls } from './Controls/Controls';
import { Button } from './Button/Button';
import { UploadedFile, uploadHandler } from './helpers/uploadHandler';
import { getTrackMetaData, TrackMetadata, DEFAULT_TRACK_METADATA } from './helpers/trackMetadata';
import { getSongLength } from './helpers/getSongLength';
import { downloadHandler } from './helpers/downloadHandler';
import { useInterval } from '../hooks/useInterval';
import styles from './MainView.module.css';

function _updateReverbDecay(reverb: Tone.Reverb, value: number) { reverb.decay = value };
function _updateReverbPreDelay(reverb: Tone.Reverb, value: number) { reverb.preDelay = value };
const updateReverbDecay = debounce(_updateReverbDecay, 500);
const updateReverbPreDelay = debounce(_updateReverbPreDelay, 500);

const defaultValues = {
    playBackRate: 0.8,
    reverbWet: 0.6,
    reverbDecay: 6,
    reverbPreDelay: 0.1
};

export const MainView: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [songInfo, setSongInfo] = useState<TrackMetadata>(DEFAULT_TRACK_METADATA);
    const [currentPlayback, setCurrentPlayback] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [downloadURL, setDownloadURL] = useState<string | undefined>();
    const [preparingDownload, setPreparingDownload] = useState<boolean>(false);
    const [uploadedFile, setUploadedFile] = useState<UploadedFile | undefined>();

    // Controls
    const [playbackRate, setPlaybackRate] = useState<number>(defaultValues.playBackRate);
    const [reverbWet, setReverbWet] = useState<number>(defaultValues.reverbWet);
    const [reverbDecay, setReverbDecay] = useState<number>(defaultValues.reverbDecay);
    const [reverbPreDelay, setReverbPreDelay] = useState<number>(defaultValues.reverbPreDelay);

    const { clear: clearIntervale, start: startInterval } = useInterval(() => {
        setCurrentPlayback((playback) => playback + 1)
    }, 1000, false);

    const reverb = useMemo(() => new Tone.Reverb(), []);
    const player = useMemo(() => new Tone.Player(), []);

    const onInit = async (trackUrl: string, file: File) => {
        const p1 = reverb.generate();
        const p2 = player.load(trackUrl);
        await Promise.all([p1, p2]);
        player.playbackRate = defaultValues.playBackRate;
        reverb.wet.value = defaultValues.reverbWet;
        reverb.decay = defaultValues.reverbDecay;
        reverb.toDestination();
        player.connect(reverb);

        const trackMetadata = await getTrackMetaData(file || trackUrl);
        setSongInfo({ ...trackMetadata, length: getSongLength(player.buffer.duration, playbackRate) });
    };

    useEffect(() => {
        // Delete the download URL when we unmount the component
        return () => {
            if (downloadURL) window.URL.revokeObjectURL(downloadURL);
        }
    }, []);

    useEffect(() => {
        isPlaying ? startInterval() : clearIntervale();
    }, [isPlaying]);

    // Player handlers
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

    // Controls handlers
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

    const onSave = downloadHandler({
        bufferDuration: player.buffer.duration,
        downloadURL,
        playbackRate,
        reverbWet,
        reverbDecay,
        reverbPreDelay,
        uploadedFileURL: uploadedFile?.objectURL,
        setDownloadURL,
        setPreparingDownload
    });

    const onFileUpload = uploadHandler({
        setUploadedFile,
        setLoading,
        initializePlayer: onInit
    });

    const loadSong = () => {
        document.getElementById("songInput")?.click();
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (!player.loaded) {
        return (
            <>
                <Button fullWidth disabled={preparingDownload} onClick={loadSong}>Upload song</Button>
                <input id="songInput" name="song-input" type="file" accept="audio/mp3" onChange={onFileUpload} />
            </>
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
                    preparingDownload && <div>Loading...</div>
                }
            </div>
        </div>
    );
};
