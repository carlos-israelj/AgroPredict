import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';

// Configurar el root de React
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderizar la aplicación
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);