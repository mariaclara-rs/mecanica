import React from 'react';
import ReactDOM from 'react-dom';//permite que o react se comunique com a arvore de elementos dom (html)
import Rotas from './routes';
import VLibras from '@djpfs/react-vlibras'

ReactDOM.render(
    <React.StrictMode>
      <VLibras />
      <Rotas />
    </React.StrictMode>,
    document.getElementById('root')
);
