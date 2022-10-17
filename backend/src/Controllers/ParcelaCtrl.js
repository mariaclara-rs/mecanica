const db = require('../models/Database')

module.exports = {
    async gravar(request, response){
        const {num,cpId,val,dtPgto,dtVenc} = request.body;
        const sql = "INSERT INTO parcela (parc_num,cp_id,parc_val,parc_dtPgto,parc_dtVenc) " +
            "VALUES (?,?,?,?,?)";
        const valores = [
            num,cpId,val,dtPgto,dtVenc
        ];
        await db.conecta();
        const result = await db.manipula(sql, valores);
        return response.json(result);
    },
    async editar(request, response){
        const {parc_num,cp_id,parc_val,parc_dtPgto,parc_dtVenc,parc_metodoPgto,parc_anotacoes} = request.body;
        console.log(parc_num,cp_id,parc_val,parc_dtPgto,parc_dtVenc,parc_metodoPgto,parc_anotacoes);
        const sql = "UPDATE parcela set parc_val=?,parc_dtPgto=?,parc_dtVenc=?,parc_metodoPgto=?,parc_anotacoes=? "
                    +"where parc_num=? and cp_id=?";
        const valores = [parc_val,parc_dtPgto,parc_dtVenc,parc_metodoPgto,parc_anotacoes,parc_num,cp_id];
        await db.conecta();
        const result = await db.manipula(sql,valores);
        return response.json(result);
    },
    async excluirPorCP(request, response){
        const {cp_id} = request.params;
        const sql = "DELETE FROM parcela WHERE cp_id=?";
        await db.conecta();
        const result = await db.manipula(sql,[cp_id]);
        return response.json(result);
    }
}