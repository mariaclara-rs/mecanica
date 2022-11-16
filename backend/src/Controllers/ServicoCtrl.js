const db = require('../models/Database')

module.exports = {
    async listar (request, response){
        const con = await db.conecta();
        const sql = "SELECT * FROM servico ORDER BY ser_id";
        const ser = await db.consulta(sql);
        return response.json(ser.data);
    },
    async gravar(request, response){
        const {nome,maoObra,descricao} = request.body;
        const sql = "INSERT INTO servico (ser_nome, ser_maoObra, ser_descricao) " +
            "VALUES (?,?,?)";
        const valores = [
            nome,maoObra,descricao
        ];
        await db.conecta();
        const result = await db.manipula(sql, valores);
        return response.json(result);
    },
    async editar(request, response){
        const {id, nome,maoObra,descricao} = request.body;
        const sql = "UPDATE servico SET ser_nome = ?, ser_maoObra = ?, ser_descricao = ? "+ 
            "where ser_id = ?";
        const valores = [
            nome, maoObra, descricao, id
        ];
        await db.conecta();
        const result = await db.manipula(sql, valores);
        return response.json(result);
    },
    async excluir(request, response){
        const {id} = request.params;
        const sql = "DELETE FROM servico WHERE ser_id=?";
        await db.conecta();
        const result = await db.manipula(sql,[id]);
        return response.json(result);
    },
    async listarPorNome(request, response) {
        const { nome } = request.query;
        const con = await db.conecta();

        const sql = "select * from servico where ser_nome LIKE concat('%',?,'%')";
        const result = await db.consulta(sql, [nome]);
        return response.json(result);
    },
}