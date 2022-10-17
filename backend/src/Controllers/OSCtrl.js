const db = require('../models/Database')

module.exports = {
    async listar(request, response) {
        const con = await db.conecta();
        const sql = "select os.os_id, os.os_dataAbertura, os.os_dataFechamento, os.os_vekm, os.os_valTot, "
            + "os.os_observacoes, os.os_status,os.os_valFiado, os.os_metodoReceb, os.os_qtdeParcelas, "
            + "v.ve_id, v.ve_placa, c.cli_id, c.cli_nome, m.mc_id, m.mc_nome "
            + "from ordemservico os left join veiculo v on os.ve_id = v.ve_id "
            + "left join cliente c on (v.cli_id = c.cli_id or c.cli_id=os.cli_id)"
            + "left join marca m on v.mc_id = m.mc_id";
        const os = await db.consulta(sql);
        return response.json(os.data);
    },
    async gravar(request, response) {
        const { dataAbertura, ve_id, vekm, valTot, status, observacoes } = request.body;
        console.log(dataAbertura, ve_id, vekm, valTot, status, observacoes)
        const sql = "insert into ordemservico (os_dataAbertura, ve_id, os_vekm, os_valTot, os_status, os_observacoes) "
            + "values (?,?,?,?,?,?)";
        const valores = [dataAbertura, ve_id, vekm, valTot, status, observacoes]
        await db.conecta();
        const result = await db.manipula(sql, valores);
        return response.json(result);
    },
    async gravarOrcamento(request, response) {
        const { dataAbertura, ve_id, vekm, valTot, status, observacoes, cli_id } = request.body;
        console.log(dataAbertura, ve_id, vekm, valTot, status, observacoes)
        const sql = "insert into ordemservico (os_dataAbertura, ve_id, os_vekm, os_valTot, os_status, os_observacoes,cli_id) "
            + "values (?,?,?,?,?,?,?)";
        const valores = [dataAbertura, ve_id, vekm, valTot, status, observacoes, cli_id]
        await db.conecta();
        const result = await db.manipula(sql, valores);
        return response.json(result);
    },
    async editar(request, response) {
        const { os_id, os_dataAbertura, os_dataFechamento, ve_id, os_vekm, os_valTot,
            os_status, os_observacoes, os_metodoReceb, os_qtdeParcelas, os_valFiado, os_dataReceb } = request.body;

        const sql = "UPDATE ordemservico SET os_dataAbertura=?, os_dataFechamento=?, ve_id=?, os_vekm=?, os_valTot=?, " +
            "os_status=?, os_observacoes=?, os_metodoReceb=?, os_qtdeParcelas=?, os_valFiado=?, os_dataReceb=? " +
            "WHERE os_id = ?";
        const valores = [os_dataAbertura, os_dataFechamento, ve_id, os_vekm, os_valTot,
            os_status, os_observacoes, os_metodoReceb, os_qtdeParcelas, os_valFiado, os_dataReceb, os_id];
        await db.conecta();
        const result = await db.manipula(sql, valores);
        return response.json(result);
    },

    async editar2(request, response) {
        const { os_id, ve_id, os_vekm, os_valTot, os_status, os_observacoes, cli_id } = request.body;
        const sql = "UPDATE ordemservico SET ve_id=?, os_vekm=?, os_valTot=?, os_status=?, os_observacoes=?, cli_id=? " +
            "WHERE os_id = ?";
        const valores = [ve_id, os_vekm, os_valTot, os_status, os_observacoes, cli_id, os_id];
        await db.conecta();
        const result = await db.manipula(sql, valores);
        return response.json(result);
    },
    async excluir(request, response) {
        const { os_id } = request.params;
        const sql = "DELETE FROM ordemservico WHERE os_id=?";
        await db.conecta();
        const result = await db.manipula(sql, [os_id]);
        return response.json(result);
    }

}