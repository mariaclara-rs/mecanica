const db = require('../models/Database')

module.exports = {
    async listarPorOS(request,response){
        const {os_id} = request.params;
        const sql = "select sos.ser_id, ser_nome, serOS_val, s.ser_maoObra from servicoos sos, servico s where sos.ser_id = s.ser_id "
        +"and os_id=?"
        const valor = [os_id]
        await db.conecta()
        const result = await db.consulta(sql,valor)
        return response.json(result.data)
    },
    async gravar(request,response){
        const {os_id, ser_id, serOS_val} = request.body;
        const sql = "insert into servicoos (os_id, ser_id, serOS_val) "
        +"values (?,?,?)";
        const valores = [os_id, ser_id, serOS_val]
        await db.conecta();
        const result = await db.manipula(sql, valores);
        return response.json(result);
    },
    async excluirPorOS(request, response){
        const {os_id} = request.params;
        const sql = "DELETE FROM servicoos WHERE os_id=?";
        await db.conecta();
        const result = await db.manipula(sql,[os_id]);
        return response.json(result);
    }
}