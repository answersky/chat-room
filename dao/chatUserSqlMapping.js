var user = {
    addUser:'insert into chat_user(username,password,time,status) values(?,?,?,"1")',
    findUsers: 'select * from chat_user',
    findUserByName:'select * from chat_user where username=? and password=?'
};

module.exports = user;