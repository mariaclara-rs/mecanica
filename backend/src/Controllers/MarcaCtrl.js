const db = require('../models/Database')

module.exports = {
    async listar (request, response){
        const con = await db.conecta();
        const sql = "SELECT * FROM Marca ORDER BY mc_nome";
        const marca = await db.consulta(sql);
        return response.json(marca.data);
    },
    async gravar(request, response){
        const {nome} = request.body;
        const sql = "INSERT INTO Marca (mc_nome) VALUES (?)";
        const valor = [nome];
        await db.conecta();
        const result = await db.manipula(sql, valor);
        return response.json(result);
    },
    async editar(request, response){
        const {id,nome} = request.body;
        const sql = "UPDATE Marca SET mc_nome = ? where mc_id = ?";
        const valores = [
            nome, id
        ];
        await db.conecta();
        const result = await db.manipula(sql, valores);
        return response.json(result);
    },
    async excluir(request, response){
        const {id} = request.params;
        const sql = "DELETE FROM Marca WHERE mc_id=?";
        await db.conecta();
        const result = await db.manipula(sql,[id]);
        return response.json(result);
    },
    async listarPorNome(request, response) {
        const { nome } = request.query;
        const con = await db.conecta();

        const sql = "select * from Marca where mc_nome LIKE concat('%',?,'%')";
        const result = await db.consulta(sql, [nome]);
        return response.json(result);
    },
}