import { useEffect, useRef } from "react";

export function useInterval(
    handler: Parameters<typeof setInterval>[number],
    ms: number,
    autoPlay: boolean = true
) {
    const interval = useRef<NodeJS.Timeout>();
    const handlerRef = useRef(handler);

    useEffect(() => {
        if (!interval.current && autoPlay) {
            interval.current = setInterval(handlerRef.current, ms);
        }
        return () => clear();
    }, [ms, autoPlay]);

    useEffect(() => {
        handlerRef.current = handler;
    }, [handler]);

    const clear = () => {
        if (interval.current) {
            clearInterval(interval.current);
        }
    }

    const start = () => {
        interval.current = setInterval(handlerRef.current, ms);
    }

    return {
        clear,
        start
    }
}
