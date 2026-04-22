import React from 'react';
import { useCartStore } from '../store/cartStore.js';

export default function Cart() {
    const items = useCartStore((state) => state.items);
    
    return (
        <div>
            <h1>Your Cart</h1>
            <ul>
                {items.map((item, i) => <li key={i}>{item.name}</li>)}
            </ul>
        </div>
    );
}
