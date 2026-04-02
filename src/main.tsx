import react from 'react';
import reactDom from 'react-dom/client';
import App from './App';

//ищем div с id ="root"
const rootElement = document.getElementById('root') as HTMLElement;

// в этом div-е мы будем рендерить наше приложение
const root = reactDom.createRoot(rootElement);
root.render(
    <react.StrictMode>
        <App />
    </react.StrictMode>
);
