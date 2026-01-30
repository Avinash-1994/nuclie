import React from 'react';
import styles from './Button.module.css';

export const Button = ({ variant = 'primary' }) => {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      Click Me
    </button>
  );
};