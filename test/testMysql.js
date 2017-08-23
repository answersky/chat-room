/**
 * Created by Administrator on 2017/7/1.
 */
//连接数据库
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123',
    database:'test'
});

connection.connect();
//查询
connection.query('SELECT * from user', function(err, rows, fields) {
    if (err) throw err;
    console.log('The solution is: ', rows[0]);
});
//关闭连接
connection.end();