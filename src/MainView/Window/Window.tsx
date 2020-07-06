import React from 'react';
import styles from './Window.module.css';

interface IWindowProps {
    children: React.ReactChild;
    title?: string;
    footer?: React.ReactNode;
}

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