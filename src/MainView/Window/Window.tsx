import React from 'react';
import styles from './Window.module.css';

interface IWindowProps {
    children: React.ReactChild;
    title?: string;
    footer?: React.ReactNode;
}

/**
 * Wrapper component that has the appearance of an old WS' window 
 * @param props 
 * @returns 
 */
export const Window: React.FC<IWindowProps> = ({ children, title, footer }) => {
    return (
        <div className={styles["windows-alert"]}>
            <div className={styles["windows-alert-title"]}>{Boolean(title) ? title : ""}</div>
            <div className={styles["windows-alert-body"]}>
                {children}
                {
                    Boolean(footer) && (
                        <div className={styles["windows-alert-footer"]}>
                            {footer}
                        </div>
                    )
                }
            </div>
        </div>
    );
};
