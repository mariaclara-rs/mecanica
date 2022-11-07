const mysql = require('mysql2/promise');
require('dotenv').config()
module.exports = new
    class Database {
        constructor() {
            this.err = "";
        }

        async conecta() {
            const config = {
                host: "den1.mysql4.gear.host",
                database: "aulaslp2", 
                user: "aulaslp2",
                password: "lasanha_123"
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