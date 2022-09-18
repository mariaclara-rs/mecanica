const db = require('../models/Database')

module.exports = {
    async listar (request, response){
        const con = await db.conecta();
        const sql = "SELECT * FROM peca ORDER BY pec_nome";
        const peca = await db.consulta(sql);
        return response.json(peca.data);
    },
    async gravar(request, response){
        const {nome,preco} = request.body;
        const sql = "INSERT INTO peca (pec_nome, pec_preco) " +
            "VALUES (?,?)";
        const valores = [
            nome,preco
        ];
        await db.conecta();
        const result = await db.manipula(sql, valores);
        return response.json(result);
    },
    async editar(request, response){
        const {id,nome,preco} = request.body;
        const sql = "UPDATE peca SET pec_nome = ?, pec_preco = ? "+ 
            "where pec_id = ?";
        const valores = [
            nome, preco, id
        ];
        await db.conecta();
        const result = await db.manipula(sql, valores);
        return response.json(result);
    },
    async excluir(request, response){
        const {id} = request.params;
        const sql = "DELETE FROM peca WHERE pec_id=?";
        await db.conecta();
        const result = await db.manipula(sql,[id]);
        return response.json(result);
    },
    async listarPorNome(request, response) {
        const { nome } = request.query;
        const con = await db.conecta();

        const sql = "select * from peca where pec_nome LIKE concat('%',?,'%')";
        const result = await db.consulta(sql, [nome]);
        return response.json(result);
    }
}