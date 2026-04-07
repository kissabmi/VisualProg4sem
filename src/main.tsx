import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

// ищем div с id="root"
const rootElement = document.getElementById('root') as HTMLElement;

// в этом div-е мы будем рендерить наше приложение
const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
