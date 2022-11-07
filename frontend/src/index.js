import React from 'react';
import ReactDOM from 'react-dom';//permite que o react se comunique com a arvore de elementos dom (html)
import Rotas from './routes';

ReactDOM.render(
    <React.StrictMode>
      <Rotas />
    </React.StrictMode>,
    document.getElementById('root')
);
