import React from 'react';
import styles from './Player.module.css';

type CoverArtProps = {
    src?: string;
}

/**
 * Picture to be displayed in the player.
 * If no source is provided a default div will take its place
 * @param param0 
 * @returns 
 */
export const CoverArt: React.FC<CoverArtProps> = ({ src }) => {
    if (!src) {
        return (
            <div className={`${styles['cover-art']} ${styles['empty']}`}>
                💿
            </div>
        )
    }
    return (
        <img className={styles['cover-art']}
            alt="cover art"
            src={src} />
    )
}
