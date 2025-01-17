import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import App from './App';
import './index.css'; // For global styles if you have them

const container = document.getElementById('root'); // Get the root element
const root = createRoot(container); // Create a root

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
