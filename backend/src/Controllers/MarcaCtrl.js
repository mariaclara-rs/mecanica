const db = require('../models/Database')

module.exports = {
    async listar (request, response){
        const con = await db.conecta();
        const sql = "SELECT * FROM marca ORDER BY mc_id";
        const marca = await db.consulta(sql);
        return response.json(marca.data);
    },
    async gravar(request, response){
        const {nome} = request.body;
        const sql = "INSERT INTO marca (mc_nome) VALUES (?)";
        const valor = [nome];
        await db.conecta();
        const result = await db.manipula(sql, valor);
        return response.json(result);
    },
    async editar(request, response){
        const {id,nome} = request.body;
        const sql = "UPDATE marca SET mc_nome = ? where mc_id = ?";
        const valores = [
            nome, id
        ];
        await db.conecta();
        const result = await db.manipula(sql, valores);
        return response.json(result);
    },
    async excluir(request, response){
        const {id} = request.params;
        const sql = "DELETE FROM marca WHERE mc_id=?";
        await db.conecta();
        const result = await db.manipula(sql,[id]);
        return response.json(result);
    },
    async listarPorNome(request, response) {
        const { nome } = request.query;
        const con = await db.conecta();

        const sql = "select * from marca where mc_nome LIKE concat('%',?,'%')";
        const result = await db.consulta(sql, [nome]);
        return response.json(result);
    },
}