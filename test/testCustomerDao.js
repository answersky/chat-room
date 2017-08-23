/**
 * Created by Administrator on 2017/6/21.
 */

var userDao = require("../dao/chatUserDao");
var messageDao = require("../dao/messageDao");

/*userDao.addUser('xm','123456',function (result) {
    console.log(result);
    userDao.findUsers(function (data) {
        console.log(data);
    });
});*/


/*userDao.findUserByName('answer','123456',function (result) {
    console.log(result);
});*/


/*
messageDao.saveMessage('answer','大家好',function (data) {
    console.log(data);
});*/

messageDao.findMessages(function (data) {
   console.log(data);

   var arr=[1,2,3];

   arr.remove(1);
   console.log(arr);

});

Array.prototype.remove=function(value){
    var len = this.length;
    for(var i=0,n=0;i<len;i++){//把出了要删除的元素赋值给新数组
        if(this[i]!=value){
            this[n++]=this[i];
        }else{
            console.log(i);//测试所用
        }
    }
    this.length = n;
};