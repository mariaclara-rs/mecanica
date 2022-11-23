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

routes.get('/agenda',checkToken,AgendaCtrl.listar)
routes.get('/agenda/data',AgendaCtrl.listarFiltroData)
routes.post('/agenda',AgendaCtrl.gravar)
routes.put('/agenda',AgendaCtrl.editar)
routes.delete('/agenda/:ag_id',AgendaCtrl.excluir)

const CrCtrl = require('./Controllers/ContaReceberCtrl')

routes.get('/contareceber',checkToken,CrCtrl.listar);
routes.post('/contareceber',CrCtrl.gravar)
routes.post('/contareceber/completo',CrCtrl.gravarCompleto);
routes.put('/contareceber',CrCtrl.editar);
routes.get('/contareceber/:os_id',CrCtrl.listarPorOS);

routes.post('/authenticate',checkToken, (req,resp)=>{return resp.json({"status":true})})

const OSCtrl = require('./Controllers/OSCtrl');

routes.get('/ordemservico',checkToken,OSCtrl.listar);
routes.post('/ordemservico',OSCtrl.gravar);
routes.post('/ordemservico/orcamento',OSCtrl.gravarOrcamento);
routes.put('/ordemservico',OSCtrl.editar);
routes.put('/ordemservico/editar',OSCtrl.editar2);
routes.delete('/ordemservico/:os_id',OSCtrl.excluir);

const SerOSCtrl = require('./Controllers/ServicoOSCtrl');

routes.post('/servicoos/',SerOSCtrl.gravar);
routes.get('/servicoos/:os_id',checkToken,SerOSCtrl.listarPorOS);
routes.delete('/servicoos/:os_id',SerOSCtrl.excluirPorOS);

const PecaOSCtrl = require('./Controllers/PecaOSCrtl');

routes.post('/pecaos',PecaOSCtrl.gravar);
routes.get('/pecaos/:os_id',checkToken,PecaOSCtrl.listarPorOS);
routes.delete('/pecaos/:os_id',PecaOSCtrl.excluirPorOS);

const CliCtrl = require('./Controllers/ClienteCtrl');

routes.get('/clientes',checkToken,CliCtrl.listar);
routes.post('/clientes/cadastrar',CliCtrl.gravar);
routes.put('/clientes/editar',CliCtrl.editar);
routes.delete('/clientes/:id',CliCtrl.excluir);
routes.get('/clientes/nome',CliCtrl.listarPorNome);

const MarcaCtrl = require('./Controllers/MarcaCtrl');

routes.get('/marcas',checkToken, MarcaCtrl.listar);
routes.post('/marcas/gravar',MarcaCtrl.gravar);
routes.put('/marcas/editar',MarcaCtrl.editar);
routes.delete('/marcas/:id',MarcaCtrl.excluir);
routes.get('/marcas/nome',checkToken,MarcaCtrl.listarPorNome);

const VeiculoCtrl = require('./Controllers/VeiculoCtrl');

routes.get('/veiculos',checkToken,VeiculoCtrl.listar);
routes.get('/veiculos/cliente',checkToken,VeiculoCtrl.listarPorCliente);
routes.get('/veiculos/marca',checkToken,VeiculoCtrl.listarPorMarca);
routes.get('/veiculos/placa',checkToken,VeiculoCtrl.BuscarPlaca);
routes.post('/veiculos/gravar',VeiculoCtrl.gravar);
routes.put('/veiculos/editar',VeiculoCtrl.editar);
routes.delete('/veiculos/:id',VeiculoCtrl.excluir);
routes.get('/veiculos/cliente/:cliId',checkToken,VeiculoCtrl.listarVeiculosDeCliente);

const ServicoCtrl = require('./Controllers/ServicoCtrl');

routes.get('/servicos',checkToken,ServicoCtrl.listar);
routes.post('/servicos/gravar',ServicoCtrl.gravar);
routes.put('/servicos/editar',ServicoCtrl.editar);
routes.delete('/servicos/:id',ServicoCtrl.excluir);
routes.get('/servicos/nome',checkToken,ServicoCtrl.listarPorNome);

const DistCtrl = require('./Controllers/DistribuidoraCtrl')

routes.get('/distribuidoras',checkToken,DistCtrl.listar);
routes.post('/distribuidoras/gravar',DistCtrl.gravar);
routes.put('/distribuidoras/editar',DistCtrl.editar);
routes.delete('/distribuidoras/:id',DistCtrl.excluir);
routes.get('/distribuidoras/nome',checkToken,DistCtrl.listarPorNome);

const PecaCtrl = require('./Controllers/PecaCtrl')

routes.get('/pecas',checkToken,PecaCtrl.listar);
routes.post('/pecas/gravar',PecaCtrl.gravar);
routes.put('/pecas/editar',PecaCtrl.editar);
routes.delete('/pecas/:id',PecaCtrl.excluir);
routes.get('/pecas/nome',checkToken,PecaCtrl.listarPorNome);

const MecCtrl = require('./Controllers/MecanicaCtrl')

routes.get('/mecanica',checkToken,MecCtrl.listar);
routes.post('/mecanica',MecCtrl.gravar);
routes.put('/mecanica',MecCtrl.editar)

const UsuCtrl = require('./Controllers/UsuarioCtrl');


routes.get('/usuario',checkToken,UsuCtrl.listar);
routes.post('/usuario/gravar',UsuCtrl.gravar);
routes.put('/usuario/editar',UsuCtrl.editar);
routes.delete('/usuario/:id',UsuCtrl.excluir)

routes.get('/login',UsuCtrl.login);

const TpDespCtrl = require('./Controllers/TipoDespesaCtrl');

routes.get('/tpdespesa',TpDespCtrl.listar);

const CpCtrl = require('./Controllers/ContaPagarCtrl')

routes.get('/contapagar',CpCtrl.listar);
routes.post('/contapagar',CpCtrl.gravar)
routes.put('/contapagar',CpCtrl.editarSimplificado);

const ParcelaCtrl = require('./Controllers/ParcelaCtrl')

routes.post('/parcela',ParcelaCtrl.gravar)
routes.put('/parcela',ParcelaCtrl.editar);
routes.delete('/parcela/:cp_id',ParcelaCtrl.excluirPorCP);

const PecaCPCtrl = require('./Controllers/PecaCPCtrl')

routes.post('/pecacp',PecaCPCtrl.gravar)
routes.delete('/pecacp/:cp_id',PecaCPCtrl.excluirPorCP);

const RelCtrl = require ('./Controllers/RelatorioCtrl')

routes.get('/relcaixa',RelCtrl.CaixaPeriodo);
routes.get('/clientesinadimplentes',RelCtrl.ClientesInadimplentes)
routes.get('/relcaixasimplificado',RelCtrl.CaixaPeriodoSimplificado);

module.exports = routes;