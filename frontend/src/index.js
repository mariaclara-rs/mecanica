import React from 'react';
import ReactDOM from 'react-dom/client';//permite que o react se comunique com a arvore de elementos dom (html)
import Rotas from './routes';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
      <Rotas />
    </React.StrictMode>
);
