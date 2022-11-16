const db = require('../models/Database')

module.exports = {
    async CaixaPeriodo(request,response){
        const {dtIni, dtFim} = request.query;
        const sql = "select * from "
        +"((select os.os_dataFechamento as data, 'OS' as tipo, os.os_id as id, sum(os.os_valTot - os.os_valFiado) as val "
        +"from ordemservico os "
        +"where "
        +"os.os_valTot > os.os_valFiado "
        +"group by os.os_id) "
        +"union "
        +"(select cr.cr_dtReceb, 'CR', cr.cr_id, cr.cr_valorReceb "
        +"from contareceber cr "
        +"where "
        +"cr.cr_valorReceb > 0) "
        +"union "
        +"(select p.parc_dtPgto , 'CP', p.cp_id, sum(p.parc_val) from parcela p "
        +"where "
        +"p.parc_val>0 "
        +"group by p.cp_id, p.parc_dtPgto)) as tab "
        +"where tab.data between ? and ? "
        +"order by tab.data";
        const valor = [dtIni,dtFim]
        await db.conecta()
        const result = await db.consulta(sql,valor)
        return response.json(result.data)
    },
    async ClientesInadimplentes(request,response){
        const sql = "select c.cli_nome, c.cli_tel, c.cli_cpf , sum(cr.cr_valor) as valDevido from contareceber cr "
        +"inner join ordemservico os on os.os_id = cr.os_id "
        +"inner join veiculo v on v.ve_id = os.ve_id "
        +"inner join cliente c on c.cli_id = v.cli_id "
        +"where cr.cr_dtReceb is null and cr.cr_dtVenc < current_date() "
        +"group by c.cli_id";

        await db.conecta();
        const result = await db.consulta(sql, [])
        return response.json(result.data)
    }
}