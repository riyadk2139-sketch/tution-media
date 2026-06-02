import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app.jsx';

const root = document.getElementById('root');
createRoot(root).render(<App palette="midnight" />);
