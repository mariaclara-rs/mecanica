const db = require('../models/Database')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const { json } = require('express');
const saltRounds = 10;
module.exports = {
    async listar(request,response){
        //console.log(request.headers)
        const sql = "SELECT * FROM usuario";
        await db.conecta();;
        const usu = await db.consulta(sql)
        return response.json(usu.data);
    },
    async gravar(request,response){

        const {nome,login,senha,mecId} = request.body;

        const senhaHash = await bcrypt.hash(senha, saltRounds);

        const sql = "INSERT INTO usuario (usu_nome,usu_login,usu_senha,mec_id) "+
                    "values(?,?,?,?)"
        
        const valores = [nome,login,senhaHash,mecId];
        await db.conecta();
        const result = await db.manipula(sql,valores);
        return response.json(result)
    },
    async editar (request,response){
        const {id,nome,login,senha,mecId} = request.body;
        const sql = "UPDATE usuario SET usu_nome = ?, usu_login = ? WHERE usu_id = ?"
        const valores = [nome,login,senha,id];
        await db.conecta();
        const result = await db.manipula(sql,valores)
        return response.json(result)
    },
    async excluir(request, response){
        const {id} = request.params;
        const sql = "DELETE FROM usuario WHERE usu_id=?";
        await db.conecta();
        const result = await db.manipula(sql,[id]);
        return response.json(result);
    },
    async login(request,response){
        console.log("login")
        const {login,senha} = request.query;
        //console.log(request.headers['authorization'])
        const sql = "SELECT * FROM usuario WHERE usu_login = ?";
        await db.conecta();
        const usu = await db.consulta(sql,[login])

        usu.status=false
        if(usu.data.length==0)
            usu.message="Usuário não existente"
        else{
            if(await bcrypt.compare(senha,usu.data[0].usu_senha)){
                usu.status=true
                const secret = process.env.SECRET
                const token = jwt.sign({
                    id: usu.data[0].usu_id
                },secret)
                usu.token = token
            }   
            else
                usu.message="Senha incorreta"
        }
        return response.json({"msg":"aqui"})
    }
}