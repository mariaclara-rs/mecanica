const mysql = require('mysql2/promise');
require('dotenv').config()
module.exports = new
    class Database {
        constructor() {
            this.err = "";
        }

        async conecta() {
            const config = {
                host: process.env.HOST,
                database: process.env.DATABASE, 
                user: process.env.USER,
                password: process.env.PASSWORD
            }
            try {
                this.connection = await new mysql.createConnection(config);
                return true;
            }
            catch (ex) {
                return false;
            }
        }
        //para SELECT
        async consulta(sql, values) {
            try {
                const [rows, fields] = await this.connection.execute(sql, values);
                return {
                    status: true,
                    data: rows,
                    message: "",
                    token: "",
                }
            }
            catch (ex) {
                return {
                    status: false,
                    err: ex.code,
                    message: ex.message,
                    data: []
                };
            }
        }//fim do método consulta
        //para insert, update e delete
        async manipula(sql, values) {
            try {
                
                const [rows, fields] = await this.connection.execute(sql, values);


                if (rows.affectedRows > 0) //qtde de linhas afetadas
                    return {
                        status: true,
                        lastId: rows.insertId
                        //data: rows
                    }
                return {

                    status: false,
                    err: "NOT_ROWS"
                };
            }
            catch (ex) {
                return {
                    status: false,
                    err: ex.code,
                    message: ex.message
                }
            }
        }
    }