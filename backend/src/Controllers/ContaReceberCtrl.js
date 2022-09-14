const db = require('../models/Database')

module.exports = {
    async listar (request, response){
        const con = await db.conecta();
        const sql = " select cr.cr_id, o.os_id, o.os_observacoes, cr.cr_dtVenc, cr.cr_valor, v.ve_id,"
        +"ve_placa, c.cli_id, cli_nome, cli_tel "
        +"from contareceber cr, ordemservico o, veiculo v, cliente c "
        +"where cr.os_id = o.os_id and o.ve_id = v.ve_id and v.cli_id = c.cli_id ";
        const cr = await db.consulta(sql);
        return response.json(cr.data);
    },
    async gravar(request, response){
        const {os_id,cr_dtVenc,cr_valor} = request.body;
        const sql = "INSERT INTO contareceber (os_id,cr_dtVenc,cr_valor) " +
            "VALUES (?,?,?)";
        const valores = [
            os_id,cr_dtVenc,cr_valor
        ];
        await db.conecta();
        const result = await db.manipula(sql, valores);
        return response.json(result);
    }
}