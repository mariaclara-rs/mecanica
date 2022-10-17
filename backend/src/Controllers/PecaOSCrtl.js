const db = require('../models/Database')

module.exports = {
    async listarPorOS(request,response){
        const {os_id} = request.params;
        const sql = "select pos.pec_id, pec_nome, pecOS_valTot, pecOS_qtde, p.pec_preco from pecaos pos, peca p where pos.pec_id = p.pec_id "
        +"and os_id=?"
        const valor = [os_id]
        await db.conecta()
        const result = await db.consulta(sql,valor)
        return response.json(result.data)
    },
    async gravar(request,response){
        const {os_id, pec_id, pecOS_valTot, pecOS_qtde} = request.body;
        const sql = "insert into pecaos (os_id, pec_id, pecOS_valTot, pecOS_qtde) "
        +"values (?,?,?,?)";
        const valores = [os_id, pec_id, pecOS_valTot, pecOS_qtde]
        await db.conecta();
        const result = await db.manipula(sql, valores);
        return response.json(result);
    },
    async excluirPorOS(request, response){
        const {os_id} = request.params;
        const sql = "DELETE FROM pecaos WHERE os_id=?";
        await db.conecta();
        const result = await db.manipula(sql,[os_id]);
        return response.json(result);
    }
}