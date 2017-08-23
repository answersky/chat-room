
var pg = require('pg');

var config = {
    user: 'pm', //env var: PGUSER
    database: 'pm', //env var: PGDATABASE
    password: 'aaaaaaaa', //env var: PGPASSWORD
    host: '192.168.3.230', // Server hosting the postgres database
    port: 5432, //env var: PGPORT
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
//此时数据库必须已经创建
var pool =new pg.Pool(config);
//ask for a client from the pool
pool.connect(function(err, client, done) {
    if(err) {
        return console.error('error fetching client from pool', err);
    }

    //use the client for executing the query
    client.query('select user_name, password, age from um_user where id = $1 and user_name = $2', [8627,'xuping'], function(err, result) {
        //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
        done(err);

        if(err) {
            return console.error('error running query', err);
        }
        console.log(result.rows[0].user_name);
        //output: 1
    });
});
