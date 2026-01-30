import React from 'react';

export const Button = ({ children, onClick }: any) => {
  return (
    <button 
      onClick={onClick}
      style={{
        background: 'blue',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      {children}
    </button>
  );
};