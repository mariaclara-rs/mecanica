const db = require('../models/Database')

module.exports = {
    async gravar(request,response){
        const {cpId, pecId, qtde, valor} = request.body;
        const sql = "insert into pecascontapagar (cp_id, pec_id, pcp_qtde, pcp_valor) "
        +"values (?,?,?,?)";
        const valores = [cpId, pecId, qtde, valor]
        await db.conecta();
        const result = await db.manipula(sql, valores);
        return response.json(result);
    },
    async excluirPorCP(request, response){
        const {cp_id} = request.params;
        const sql = "DELETE FROM pecascontapagar WHERE cp_id=?";
        await db.conecta();
        const result = await db.manipula(sql,[cp_id]);
        return response.json(result);
    }
}