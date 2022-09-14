const db = require('../models/Database')
{/*request.query*/ }
module.exports = {

    async listar(request, response) {
        const con = await db.conecta();
        const sql = "select c.cli_id, cli_nome, cli_tel, ve_id, ve_placa, ve_ano, ve_cor, ve_modelo, m.mc_id, mc_nome from "+
        "Marca m, Veiculo v, Cliente c "+
        "where v.cli_id = c.cli_id and v.mc_id = m.mc_id";
        const ve = await db.consulta(sql);
        return response.json(ve.data);
    },

    async listarPorCliente(request, response) {
        const { cliente } = request.query;
        const con = await db.conecta();

        const sql = "select c.cli_id, cli_nome, cli_tel, ve_id, ve_placa, ve_cor, ve_modelo, m.mc_id, mc_nome from " +
            "Cliente c, Veiculo v, Marca m " +
            "where v.cli_id = c.cli_id and v.mc_id = m.mc_id and c.cli_nome LIKE concat('%',?,'%')";
        const result = await db.consulta(sql, [cliente]);
        return response.json(result);
    },

    async listarVeiculosDeCliente(request, response) {
        const { cliId } = request.params;
        const con = await db.conecta();

        const sql = "select ve_id, ve_placa from Veiculo v "+
            "where v.cli_id = ?";
        const result = await db.consulta(sql, [cliId]);
        return response.json(result);
    },

    async listarPorMarca(request, response) {
        const { marca } = request.query;
        const con = await db.conecta();

        const sql = "select c.cli_id, cli_nome, cli_tel, ve_id, ve_placa, ve_cor, ve_modelo, m.mc_id, mc_nome from " +
            "Cliente c, Veiculo v, Marca m " +
            "where v.cli_id = c.cli_id and v.mc_id = m.mc_id and mc_nome LIKE concat('%',?,'%')";
        const result = await db.consulta(sql, [marca]);
        return response.json(result);
    },

    async BuscarPlaca(request, response) {
        const { placa } = request.query;
        const con = await db.conecta();

        const sql = "select c.cli_id, cli_nome, cli_tel, ve_id, ve_placa, ve_cor, ve_modelo, m.mc_id, mc_nome from " +
            "Cliente c, Veiculo v, Marca m " +
            "where v.cli_id = c.cli_id and v.mc_id = m.mc_id and ve_placa = ?";
        const result = await db.consulta(sql, [placa]);
        return response.json(result);
    },

    async gravar(request, response) {
        const {placa,cor,modelo,ano,cliId,marcaId} = request.body;
       /* console.log("placa: "+placa+
                    "\ncor: "+cor+
                    "\nmodelo: "+modelo+
                    "\nano: "+ano+
                    "\ncliId: "+cliId+
                    "\nmarcaId: "+marcaId);*/
        const sql = "insert into veiculo (ve_placa,ve_cor,ve_modelo,ve_ano,cli_id,mc_id)" +
            "VALUES (?,?,?,?,?,?)";
        const valores = [
            placa,cor,modelo,ano,cliId,marcaId
        ];
        await db.conecta();
        const result = await db.manipula(sql, valores);
        return response.json(result);
    },

    async editar(request, response){
        const {id,placa,cor,modelo,ano,cliId,marcaId} = request.body;
        const sql = "UPDATE Veiculo SET ve_cor = ?, ve_modelo = ?, ve_ano = ?, mc_id = ?, cli_id = ? "+ 
            "where ve_id = ?";
        const valores = [
            cor, modelo, ano, marcaId, cliId, id
        ];
        await db.conecta();
        const result = await db.manipula(sql, valores);
        return response.json(result);
    },

    async excluir(request, response){
        const {id} = request.params;
        const sql = "DELETE FROM Veiculo WHERE ve_id=?";
        await db.conecta();
        const result = await db.manipula(sql,[id]);
        return response.json(result);
    }
}