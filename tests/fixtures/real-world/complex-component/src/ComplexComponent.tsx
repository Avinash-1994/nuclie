import React, { useState, useEffect, useContext, createContext } from 'react';

const ThemeContext = createContext({ theme: 'light' });

interface Props {
  title: string;
  items: string[];
  onSelect?: (item: string) => void;
}

export const ComplexComponent: React.FC<Props> = ({ title, items, onSelect }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    console.log('Component mounted');
    return () => console.log('Component unmounted');
  }, []);

  useEffect(() => {
    if (selected) {
      onSelect?.(selected);
    }
  }, [selected, onSelect]);

  const handleClick = (item: string) => {
    setSelected(item);
    setCount(prev => prev + 1);
  };

  return (
    <div className={`container theme-${theme}`}>
      <h1>{title}</h1>
      <p>Clicked {count} times</p>
      <ul>
        {items.map(item => (
          <li 
            key={item}
            onClick={() => handleClick(item)}
            className={selected === item ? 'selected' : ''}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};