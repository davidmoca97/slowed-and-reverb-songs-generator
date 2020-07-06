import React from 'react';
import cx from 'classnames';
import styles from './Button.module.css';

interface IButtonProps extends React.HTMLProps<HTMLButtonElement> {
    fullWidth?: boolean;
}

export const Button: React.FC<IButtonProps> = ({ children, fullWidth, className, ...rest }) => {
    const _className = cx(className, styles['btn'], {
        [styles['btn-full']]: fullWidth
    })
    return (
        <button
            {...rest as any}
            className={_className}
        >
            {children}
        </button>
    )
};


