var mysql = require('mysql');
var $conf = require('../conf/db');
var $sql = require('./messageSqlMapping');

// 使用连接池，提升性能
var pool = new mysql.createPool($conf.mysql);

module.exports = {
    saveMessage: function (username,message,cb) {
        pool.getConnection(function (err,conn) {
            if (err) console.log("POOL ==> " + err);
            conn.query($sql.saveMessage,[username,message,new Date()], function (err, result) {
                if (err) {
                    return console.error('error running query', err);
                }
                cb(result.affectedRows);
                conn.release();
            });
        });
    },
    findMessages: function (cb) {
        pool.getConnection(function (err,conn) {
            if (err) console.log("POOL ==> " + err);
            conn.query($sql.findMessages, function (err, result) {
                if (err) {
                    return console.error('error running query', err);
                }
                cb(result);
                conn.release();
            });
        });
    }
};