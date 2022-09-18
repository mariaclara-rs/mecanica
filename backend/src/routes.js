const {Router} = require('express');
const routes = Router();
const jwt = require('jsonwebtoken');


function checkToken(request, response, next){
    const token = request.headers['authorization']
    if (!token) 
        return response.json({ "mensagem": "Acesso não permitido", "status":false})
    try {
        const secret = process.env.SECRET
        jwt.verify(token,secret)
        next()
        
    } catch (error) {
        return response.json({"status": false, "mensagem":"Token inválido"})
    }
}

const AgendaCtrl = require('./Controllers/AgendaCtrl')

routes.get('/agenda',AgendaCtrl.listar)
routes.get('/agenda/data',AgendaCtrl.listarFiltroData)
routes.post('/agenda',AgendaCtrl.gravar)
routes.put('/agenda',AgendaCtrl.editar)
routes.delete('/agenda/:ag_id',AgendaCtrl.excluir)

const CrCtrl = require('./Controllers/ContaReceberCtrl')

routes.get('/contareceber',CrCtrl.listar);
routes.post('/contareceber',CrCtrl.gravar)

routes.post('/authenticate',checkToken, (req,resp)=>{return resp.json({"status":true})})

const OSCtrl = require('./Controllers/OSCtrl');

routes.get('/ordemservico',OSCtrl.listar);
routes.post('/ordemservico',OSCtrl.gravar);
routes.put('/ordemservico',OSCtrl.editar);
routes.put('/ordemservico/editar',OSCtrl.editar2);
routes.delete('/ordemservico/:os_id',OSCtrl.excluir);

const SerOSCtrl = require('./Controllers/ServicoOSCtrl');

routes.post('/servicoos/',SerOSCtrl.gravar);
routes.get('/servicoos/:os_id',SerOSCtrl.listarPorOS);
routes.delete('/servicoos/:os_id',SerOSCtrl.excluirPorOS);

const PecaOSCtrl = require('./Controllers/PecaOSCrtl');

routes.post('/pecaos',PecaOSCtrl.gravar);
routes.get('/pecaos/:os_id',PecaOSCtrl.listarPorOS);
routes.delete('/pecaos/:os_id',PecaOSCtrl.excluirPorOS);

const CliCtrl = require('./Controllers/ClienteCtrl');

routes.get('/clientes',CliCtrl.listar);
routes.post('/clientes/cadastrar',CliCtrl.gravar);
routes.put('/clientes/editar',CliCtrl.editar);
routes.delete('/clientes/:id',CliCtrl.excluir);
routes.get('/clientes/nome',CliCtrl.listarPorNome);

const MarcaCtrl = require('./Controllers/MarcaCtrl');

routes.get('/marcas',checkToken, MarcaCtrl.listar);
routes.post('/marcas/gravar',MarcaCtrl.gravar);
routes.put('/marcas/editar',MarcaCtrl.editar);
routes.delete('/marcas/:id',MarcaCtrl.excluir);
routes.get('/marcas/nome',MarcaCtrl.listarPorNome);

const VeiculoCtrl = require('./Controllers/VeiculoCtrl');

routes.get('/veiculos',VeiculoCtrl.listar);
routes.get('/veiculos/cliente',VeiculoCtrl.listarPorCliente);
routes.get('/veiculos/marca',VeiculoCtrl.listarPorMarca);
routes.get('/veiculos/placa',VeiculoCtrl.BuscarPlaca);
routes.post('/veiculos/gravar',VeiculoCtrl.gravar);
routes.put('/veiculos/editar',VeiculoCtrl.editar);
routes.delete('/veiculos/:id',VeiculoCtrl.excluir);
routes.get('/veiculos/cliente/:cliId',VeiculoCtrl.listarVeiculosDeCliente);

const ServicoCtrl = require('./Controllers/ServicoCtrl');

routes.get('/servicos',ServicoCtrl.listar);
routes.post('/servicos/gravar',ServicoCtrl.gravar);
routes.put('/servicos/editar',ServicoCtrl.editar);
routes.delete('/servicos/:id',ServicoCtrl.excluir);
routes.get('/servicos/nome',ServicoCtrl.listarPorNome);

const DistCtrl = require('./Controllers/DistribuidoraCtrl')

routes.get('/distribuidoras',DistCtrl.listar);
routes.post('/distribuidoras/gravar',DistCtrl.gravar);
routes.put('/distribuidoras/editar',DistCtrl.editar);
routes.delete('/distribuidoras/:id',DistCtrl.excluir);
routes.get('/distribuidoras/nome',DistCtrl.listarPorNome);

const PecaCtrl = require('./Controllers/PecaCtrl')

routes.get('/pecas',PecaCtrl.listar);
routes.post('/pecas/gravar',PecaCtrl.gravar);
routes.put('/pecas/editar',PecaCtrl.editar);
routes.delete('/pecas/:id',PecaCtrl.excluir);
routes.get('/pecas/nome',PecaCtrl.listarPorNome);

const MecCtrl = require('./Controllers/MecanicaCtrl')

routes.get('/mecanica',MecCtrl.listar);
routes.post('/mecanica/gravar',MecCtrl.gravar);
routes.put('/mecanica/editar',MecCtrl.editar)

const UsuCtrl = require('./Controllers/UsuarioCtrl');


routes.get('/usuario',UsuCtrl.listar);
routes.post('/usuario/gravar',UsuCtrl.gravar);
routes.put('/usuario/editar',UsuCtrl.editar);
routes.delete('/usuario/:id',UsuCtrl.excluir)

routes.get('/login',UsuCtrl.login);

module.exports = routes;