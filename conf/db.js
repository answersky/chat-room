/**
 * Created by xcy on 2017/6/20.
 */


// pg数据库联接配置
module.exports = {
    pg: {
        user: 'pm', //env var: PGUSER
        database: 'pm', //env var: PGDATABASE
        password: 'aaaaaaaa', //env var: PGPASSWORD
        host: '192.168.3.230', // Server hosting the postgres database
        port: 5432, //env var: PGPORT
        max: 10, // max number of clients in the pool
        idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
    },
    mysql:{
        host: 'localhost',
        user: 'root',
        password: '123',
        database:'test'
    }
};
