const db = require('../models/Database')

module.exports = {
    async listar(request,response){
        //console.log(request.headers)
        const sql = "SELECT * FROM tipodespesa";
        await db.conecta();;
        const tpDesp = await db.consulta(sql)
        return response.json(tpDesp.data);
    }
}