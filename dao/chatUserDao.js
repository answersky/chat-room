var mysql = require('mysql');
var $conf = require('../conf/db');
var $sql = require('./chatUserSqlMapping');

// 使用连接池，提升性能
var pool = new mysql.createPool($conf.mysql);

module.exports = {
    addUser: function (username,password,cb) {
        pool.getConnection(function (err,conn) {
            if (err) console.log("POOL ==> " + err);
            conn.query($sql.addUser,[username,password,new Date()], function (err, result) {
                if (err) {
                    return console.error('error running query', err);
                }
                cb(result.affectedRows);
                conn.release();
            });
        });
    },
    findUsers: function (cb) {
        pool.getConnection(function (err,conn) {
            if (err) console.log("POOL ==> " + err);
            conn.query($sql.findUsers, function (err, result) {
                if (err) {
                    return console.error('error running query', err);
                }
                cb(result);
                conn.release();
            });
        });
    },
    findUserByName: function (username,password,cb) {
        pool.getConnection(function (err,conn) {
            if (err) console.log("POOL ==> " + err);
            conn.query($sql.findUserByName,[username,password], function (err, result) {
                if (err) {
                    return console.error('error running query', err);
                }
                cb(result);
                conn.release();
            });
        });
    }
};