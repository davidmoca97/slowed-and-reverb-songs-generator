import * as Tone from "tone";
import audioBufferToWav from 'audiobuffer-to-wav';
import { getSongLength } from "./getSongLength";

type GetOnSaveHandlerInput = {
    downloadURL?: string;
    playbackRate: number;
    reverbWet: number;
    reverbDecay: number;
    reverbPreDelay: number;
    uploadedFileURL?: string;
    bufferDuration: number;
    setDownloadURL: (value: React.SetStateAction<string | undefined>) => void;
    setPreparingDownload: (value: React.SetStateAction<boolean>) => void;
}

export const downloadHandler = ({
    bufferDuration,
    downloadURL,
    playbackRate,
    reverbWet,
    reverbDecay,
    reverbPreDelay,
    uploadedFileURL,
    setDownloadURL,
    setPreparingDownload
}: GetOnSaveHandlerInput) => {
    return async () => {
        if (!uploadedFileURL) {
            console.error("Cannot download a track that hasn't been loaded");
            return;
        }
        if (downloadURL) {
            window.URL.revokeObjectURL(downloadURL);
            setDownloadURL(undefined);
        }
        setPreparingDownload(true);
        const duration = getSongLength(bufferDuration, playbackRate);
        const offlineContext = new Tone.OfflineContext(2, duration, 44100);
        Tone.setContext(offlineContext);
        const reverb = new Tone.Reverb();
        const player = new Tone.Player();
        const p1 = reverb.generate();
        const p2 = player.load(uploadedFileURL);

        await Promise.all([p1, p2]);

        reverb.wet.value = reverbWet;
        reverb.decay = reverbDecay;
        reverb.preDelay = reverbPreDelay;
        player.playbackRate = playbackRate;
        player.connect(reverb);
        reverb.toMaster();
        player.start(0);
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
    }
}

export const downloadFile = (url: string): void => {
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
