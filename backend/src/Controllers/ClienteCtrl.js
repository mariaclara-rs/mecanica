const axios = require('axios')
const mysql = require('mysql2/promise')
const db = require('../models/Database')


module.exports = {
    async listar (request, response){
        const con = await db.conecta();
        const sql = "SELECT * FROM cliente ORDER BY cli_id";
        const cli = await db.consulta(sql);
        return response.json(cli.data);

    },
    async gravar(request, response){
        const {cpf,nome,email,cep,endereco,tel,num,cidade} = request.body;
        console.log("gravar\ncpf: "+cpf);
        const sql = "INSERT INTO cliente (cli_cpf, cli_nome, cli_email, cli_cep, cli_endereco, cli_tel, cli_num, cli_cidade) " +
            "VALUES (?,?,?,?,?,?,?,?)";
        const valores = [
            cpf, nome, email, cep, endereco, tel, num, cidade
        ];
        await db.conecta();
        const result = await db.manipula(sql, valores);
        return response.json(result);
    },
    async editar(request, response){
        const {id,cpf,nome,email,cep,endereco,tel,num,cidade} = request.body;
        const sql = "UPDATE cliente SET cli_nome = ?, cli_email = ?, cli_cep = ?, cli_endereco = ?, cli_tel = ?, cli_num = ?, cli_cidade = ?, cli_cpf=? "+ 
            "where cli_id = ?";
        const valores = [
            nome, email, cep, endereco, tel, num, cidade, cpf, id
        ];
        await db.conecta();
        const result = await db.manipula(sql, valores);
        return response.json(result);
    },
    async excluir(request, response){
        const {id} = request.params;
        const sql = "DELETE FROM cliente WHERE cli_id=?";
        await db.conecta();
        const result = await db.manipula(sql,[id]);
        return response.json(result);
    },
    async listarPorNome(request, response) {
        const { nome } = request.query;
        const con = await db.conecta();

        const sql = "select * from cliente where cli_nome LIKE concat('%',?,'%')";
        const result = await db.consulta(sql, [nome]);
        return response.json(result);
    },
}