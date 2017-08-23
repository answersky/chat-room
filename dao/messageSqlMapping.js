var message = {
    saveMessage:'insert into message(username,message,time) values(?,?,?)',
    findMessages: 'select * from message order by time desc limit 100'
};

module.exports = message;