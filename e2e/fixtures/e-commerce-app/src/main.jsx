import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';

const Home = React.lazy(() => import('../routes/Home.jsx'));
const Cart = React.lazy(() => import('../routes/Cart.jsx'));

function App() {
  const [route, setRoute] = React.useState('home');

  return (
    <div>
      <nav>
        <button onClick={() => setRoute('home')}>Home</button>
        <button onClick={() => setRoute('cart')}>Cart</button>
      </nav>
      <Suspense fallback={<div>Loading...</div>}>
        {route === 'home' && <Home />}
        {route === 'cart' && <Cart />}
      </Suspense>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
