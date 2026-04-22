import React from 'react';
import { useCartStore } from '../store/cartStore.js';
import { formatDate } from '../utils/dateFormatter.js';
import { formatDistanceToNowStrict } from 'date-fns'; // Should be kept

export default function Home() {
    const add = useCartStore((state) => state.add);
    
    return (
        <div>
            <h1>Products</h1>
            <p>Generated at: {formatDate(new Date())}</p>
            <p>Relative: {formatDistanceToNowStrict(new Date(Date.now() - 60000))} ago</p>
            <button onClick={() => add({ id: 1, name: 'Sparx Pro' })}>Buy</button>
        </div>
    );
}
