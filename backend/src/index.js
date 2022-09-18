const express = require('express');
const routes = require('./routes');
const cors = require('cors')
const app = express();
require('dotenv').config()


app.use(
    function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    }
);
app.use(express.json());
app.use(routes);
//use indica que deve ser aplicado para todas as rotas
//nativamente o express não utiliza o json

app.listen(process.env.PORT || 3344);



//executar aplicação: node index.js
/*nodemon é a lib que mantém o node "escutando" as atualizações
que fazemos, dispesando a necessidade de executar a aplicação n
ovamente (só alterar oq precisa e atualizar a página)
executar aplicação: nodemon index.js -> yarn app
*/
