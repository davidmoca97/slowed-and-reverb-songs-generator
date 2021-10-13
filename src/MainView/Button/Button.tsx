import React from 'react';
import cx from 'classnames';
import styles from './Button.module.css';

interface IButtonProps extends React.HTMLProps<HTMLButtonElement> {
    fullWidth?: boolean;
}

/**
 * The same as the HTML button element, but with styling.
 */
export const Button: React.FC<IButtonProps> = ({ children, fullWidth, className, ...rest }) => {
    const buttonClassName = cx(className, styles['btn'], {
        [styles['btn-full']]: fullWidth
    })
    return (
        <button
            {...rest as any}
            className={buttonClassName}
        >
            {children}
        </button>
    )
};
