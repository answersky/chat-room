/**
 * Created by xcy on 2017/6/12.
 */
var pg = require('pg'); //加载模块node-postgres,该模块要与本文件放于同一个目录下
var conString = "postgres://pm:aaaaaaaa@192.168.3.230:5432/pm";//此时数据库必须已经创建
//anything://user:password@host:port/database
var client = new pg.Client(conString);

client.connect(function(err) {
    if(err) {
        return console.error('could not connect to postgres', err);
    }

    // //删除存在表
    console.log("Dropping table 'person'");
    var query = client.query("drop table if exists person");
    query.on('end', function() {
        console.log("Dropped!");
        rollback(client);
    });
    
    // //创建表
    console.log("Creating table 'person'");
    query = client.query("create table person(id serial, username varchar(10), password varchar(10), age integer)");
    query.on('end', function(){
        console.log("Created!");
        rollback(client);

    });

    //添加
    client.query('INSERT INTO person(username, password, age) VALUES($1, $2, $3)', ["zhangsan", "123456", 20], function(err, result) {
        console.log( "====================add========================");
        if(err) {
            console.log(err);
            return rollback(client);
        }
        console.log( result);
    });


    //查询
    client.query('select username, password, age from person where id = $1 and username = $2', [2,'lisi'], function(err, result) {
        console.log( "===================query=========================");
        if(err) {
            console.log(err);
        }
        console.log(result.rows[0]);
        client.end();
    });

    //更新
    client.query('update person set password=$1 where id = $2', ["11a",1], function(err, result) {
        console.log( "=====================update=======================");
        if(err) {
            console.log(err);
        }
        console.log(result);
    });

    //删除
    client.query('delete from person where id = $1', [1], function(err, result) {
        console.log( "====================remove=======================");
        if(err) {
            console.log(err);
        }
        console.log(result);
        client.end();
    });

});

var rollback = function(client) {
    client.query('ROLLBACK', function() {
        client.end();
    });
};