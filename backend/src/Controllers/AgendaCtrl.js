const db = require('../models/Database')

module.exports = {
    async listar (request, response){
        const con = await db.conecta();
        const sql = "SELECT ag_id, date(ag_data) as data, time(ag_data) as horario, ag_anotacoes, cli_nome, cli_email, c.cli_id, ve_id "
        +" FROM Agenda a, Cliente c WHERE a.cli_id=c.cli_id";
        const ag = await db.consulta(sql);
        return response.json(ag.data);
    },
    async listarFiltroData(request, response){
        const {data} = request.query;
        const sql = "select cli_nome, TIME(ag_data) as horario from agenda a, cliente c "
        +"where ag_data like concat(?,'%') and "
        +"a.cli_id = c.cli_id"
        await db.conecta();
        const result = await db.consulta(sql,[data])
        return response.json(result.data)
    },
    async gravar (request, response){
        const {ag_data, ag_anotacoes, cli_id, ve_id} = request.body;
        const sql = "INSERT INTO Agenda (ag_data, ag_anotacoes, cli_id, ve_id) " +
            "VALUES (?,?,?,?)";
        const valores = [
            ag_data, ag_anotacoes, cli_id, ve_id
        ];
        await db.conecta();
        const result = await db.manipula(sql, valores);
        return response.json(result);
    },
    async editar(request, response){
        const {ag_id, ag_data, ag_anotacoes, cli_id, ve_id} = request.body;
        const sql = "UPDATE Agenda SET ag_data = ?, ag_anotacoes = ?, cli_id=?, ve_id = ? "+ 
            "where ag_id = ?";
        const valores = [
            ag_data, ag_anotacoes, cli_id, ve_id, ag_id
        ];
        await db.conecta();
        const result = await db.manipula(sql, valores);
        return response.json(result);
    },
    async excluir(request, response){
        const {ag_id} = request.params;
        console.log(ag_id)
        const sql = "DELETE FROM Agenda WHERE ag_id=?";
        await db.conecta();
        const result = await db.manipula(sql,[ag_id]);
        return response.json(result);
    }
}