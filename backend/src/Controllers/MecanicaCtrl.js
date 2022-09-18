const db = require('../models/Database')

module.exports = {
    async listar(request,response){
        const sql = "SELECT * FROM mecanica";
        await db.conecta();
        const mec = await db.consulta(sql);
        return response.json(mec.data)
    },
    async gravar(request,response){
        const {nome,tel,cnpj,cep,endereco,num,cidade} = request.body;

        const sql = "INSERT INTO mecanica (mec_nome,mec_tel,mec_cnpj,mec_cep,mec_endereco,"+
                    "mec_num,mec_cidade) VALUES (?,?,?,?,?,?,?)"
        const valores = [nome,tel,cnpj,cep,endereco,num,cidade];
        await db.conecta();
        const result = await db.manipula(sql,valores);
        return response.json(result)
    },
    async editar(request,response){
        const {id,nome,tel,cnpj,cep,endereco,num,cidade} = request.body;

        const sql = "UPDATE mecanica SET mec_nome = ?, mec_tel = ?, mec_cnpj = ?, "+
                    "mec_cep = ?, mec_endereco = ?, mec_num = ?, mec_cidade = ? "+
                    "WHERE mec_id = ?";
        const valores = [nome,tel,cnpj,cep,endereco,num,cidade,id];
        await db.conecta();
        const result = await db.manipula(sql,valores);
        return response.json(result);
    }
}