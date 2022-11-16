const db = require('../models/Database')

module.exports = {
    async listar (request, response){
        const con = await db.conecta();
        let sql = "SELECT cp_id, cp_valTot, cp_dataCriacao, cp_anotacoes, cp_descricao, dist.dist_id, dist.dist_nome, tp.* "
        +"FROM contapagar cp left join distribuidora dist on dist.dist_id = cp.dist_id "
        +"inner join tipodespesa tp on tp.tp_id = cp.tp_id ";
        const cp = await db.consulta(sql);
        
        let cp_id, par, pcp;
        let strpar, strpcp, str;
        let resp = "";
        for(let i=0; i<cp.data.length; i++){
            cp_id = cp.data[i].cp_id;
            str = JSON.stringify(cp.data[i]);
            
            sql = "SELECT parc_num, parc_val, parc_dtPgto, parc_dtVenc, parc_metodoPgto, parc_anotacoes from contapagar cp inner join parcela par on par.cp_id = cp.cp_id where cp.cp_id="+cp_id;
            par = await db.consulta(sql);
            strpar = JSON.stringify(par.data);
            
            sql = "select pcp.pec_id, pec_nome, pcp_qtde, pcp_valor from contapagar cp inner join pecascontapagar pcp on pcp.cp_id = cp.cp_id "
            +"inner join peca p on pcp.pec_id=p.pec_id where cp.cp_id="+cp_id;
            pcp = await db.consulta(sql);
            strpcp = JSON.stringify(pcp.data);

            str = str.replace("}",",\"parcelas\":"+JSON.stringify(par.data)+",\"pecas\":"+JSON.stringify(pcp.data)+"}");
            if(i!=cp.data.length-1)
                str+=","
            resp+=str;
        }
        resp = "["+resp+"]";
        return response.json(JSON.parse(resp));
    },
    async gravar(request, response){
        const {valTot,dtCriacao,anotacoes,distId,tdId,desc} = request.body;
        const sql = "INSERT INTO contapagar (cp_valTot,cp_dataCriacao,cp_anotacoes,dist_id, tp_id,cp_descricao) " +
            "VALUES (?,?,?,?,?,?)";
        const valores = [
            valTot,dtCriacao,anotacoes,distId,tdId,desc
        ];
        await db.conecta();
        const result = await db.manipula(sql, valores);
        return response.json(result);
    },
    async editarSimplificado(request,response){
        const {cp_id, cp_valTot,dist_id,tp_id,desc} = request.body;
        console.log(cp_id+"\n"+cp_valTot+"\n"+dist_id+"\n"+tp_id)
        const sql = "UPDATE contapagar SET cp_valTot=?,dist_id=?,tp_id=?,cp_descricao=? "
                    +"WHERE cp_id = ?";
        const valores = [cp_valTot,dist_id,tp_id,desc,cp_id];
        await db.conecta();
        const result = await db.manipula(sql,valores);
        return response.json(result);
    },
}