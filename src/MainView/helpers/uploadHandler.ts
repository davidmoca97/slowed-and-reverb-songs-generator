export type UploadedFile = {
    file: File;
    objectURL: string;
}

export type OnFileDroppedHandlerInput = {
    setUploadedFile: (value: React.SetStateAction<UploadedFile | undefined>) => void;
    setLoading: (value: React.SetStateAction<boolean>) => void;
    initializePlayer: (trackURL: string, file: File) => Promise<void>; 
}

export const uploadHandler = ({
    setUploadedFile,
    setLoading,
    initializePlayer
}: OnFileDroppedHandlerInput) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) {
            return;
        }
        setLoading(true);
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', async (event) => {
            const url = event.target?.result;
            if (!url || typeof url !== "string") {
                console.error("Couldn't load the uploaded file");
                return;
            }
            setUploadedFile({ file, objectURL: url });
            await initializePlayer(url, file);
            setLoading(false);
        });
        reader.readAsDataURL(file);
    }
}
