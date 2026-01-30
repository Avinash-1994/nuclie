import React from 'react';

export const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Hello Tailwind
        </h1>
        <p className="text-gray-700 leading-relaxed">
          This is a test of Tailwind CSS processing.
        </p>
        <button className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
          Click Me
        </button>
      </div>
    </div>
  );
};