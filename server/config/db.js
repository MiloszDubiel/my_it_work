import mysql from "mysql2/promise";

export const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1qazXSW@",
  database: "myworkit",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
