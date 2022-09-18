const db = require('../models/Database')

module.exports = {
    async listar (request, response){
        const con = await db.conecta();
        const sql = "SELECT * FROM distribuidora ORDER BY dist_nome";
        const dist = await db.consulta(sql);
        return response.json(dist.data);
    },
    async gravar(request, response){
        const {nome,tel,cnpj} = request.body;
        const sql = "INSERT INTO distribuidora (dist_nome, dist_tel, dist_cnpj) " +
            "VALUES (?,?,?)";
        const valores = [
            nome,tel,cnpj
        ];
        await db.conecta();
        const result = await db.manipula(sql, valores);
        return response.json(result);
    },
    async editar(request, response){
        const {id, nome,tel,cnpj} = request.body;

        const sql = "UPDATE distribuidora SET dist_nome = ?, dist_tel = ? "+ 
            "where dist_id = ?";
        const valores = [
            nome, tel, id
        ];
        await db.conecta();
        const result = await db.manipula(sql, valores);
        return response.json(result);
    },
    async excluir(request, response){
        const {id} = request.params;
        const sql = "DELETE FROM distribuidora WHERE dist_id=?";
        await db.conecta();
        const result = await db.manipula(sql,[id]);
        return response.json(result);
    },
    async listarPorNome(request, response) {
        const { nome } = request.query;
        const con = await db.conecta();

        const sql = "select * from distribuidora where dist_nome LIKE concat('%',?,'%')";
        const result = await db.consulta(sql, [nome]);
        return response.json(result);
    }
}