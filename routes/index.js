var express = require('express');
var url = require('url');
var nodemailer = require('nodemailer');
var router = express.Router();
var multiparty = require('multiparty');
var fs = require('fs');
var querystring = require('querystring');
var async = require('async');
var userDao = require("../dao/chatUserDao");
var messageDao = require("../dao/messageDao");

//存放配置
var config = {
    socket_host: 'http://localhost:3000',
    // socket_host: 'http://114.119.6.171:8010',
    file_path: '/mnt/chat/file',
    info: '0102',//基本信息 0102
    order: '0105',//订单信息 0105
    searchModel: '0103',//搜索型号 0103
    visitorLink: '0104'//访问链接 0104
};

var transporter = nodemailer.createTransport('smtps://zu-q%40163.com:zuaa5605@smtp.163.com');


/* GET home page. */
router.get('/', function(req, res) {
  res.redirect('/login');
});

router.get('/register', function(req, res) {
    res.render('register/register');
});

//注册
router.route('/addUser').post(function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    userDao.addUser(username, password, function (result) {
        if (result==1) {
                res.send('1');
        } else {
            res.send('0');
        }
    });
});


/* GET login page. */
router.get('/login', function(req, res) {
    res.render('login/login', {title: 'user login'});
});

router.get('/logout', function (req, res) {
    req.session.name = "";
    res.locals.username = "";
    res.send("1");
});

router.route('/validateLogin').post(function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    userDao.findUserByName(username, password, function (result) {
        if (result.length > 0) {
            req.session.name = username;
            var status = result[0].status;
            if (status == '0') {
                res.send("1");
            } else {
                res.send('2');
            }
        } else {
            res.send('0');
        }
    });
});


router.get('/sendEmail', function(req, res) {
    // 解析 url 参数
    var params = url.parse(req.url, true).query;
    var to=params.to;
    var subject=params.subject;
    var text=params.text;
    var html=params.html;

    var mailOptions = {
        from: 'zuaa ✔ <zu-q@163.com>', // sender address
        // to: 'answer@qegoo.cn', // list of receivers
        to: to, // list of receivers
        // subject: 'Hello ✔', // Subject line
        subject: subject, // Subject line
        // text: 'Hello world ✔', // plaintext body
        text: text, // plaintext body
        // html: '<b>Hello world ✔</b>' // html body
        html: html // html body
    };



    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);

    });
    res.send('send email!');
});

//接收页面发送的消息
router.route("/sendMessage").post(function (req,res){
    var message=req.body.message;
    var username=req.body.username;
    var messageTo=req.body.messageTo;
    console.log(username+" send message to "+messageTo+":"+message);
    var data={"username":username,"message":message};
    res.send(data);
});

router.route("/file-upload").post(function (req, res) {
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({uploadDir: config.file_path});
    form.parse(req, function (err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);
        if (err) {
            console.log('parse error: ' + err);
            res.send("上传失败");
        } else {
            var inputFile = files['fileName'][0];
            var uploadedPath = inputFile.path;
            var dstPath = config.file_path + inputFile.originalFilename;
            //重命名为真实文件名
            fs.rename(uploadedPath, dstPath, function (err) {
                if (err) {
                    console.log('rename error: ' + err);
                } else {
                    console.log('rename ok');
                }
            });
            res.send("上传成功");
        }
    });

});


router.get('/chatHistory', function (req, res) {
    var username = req.session.name;
    messageDao.findMessages(function (history) {
        res.send({
            username: username,
            history: history
        });
    });
});

//获取在线人员
router.get('/findOnline', function (req, res) {
        var onlines=require('../bin/www').users;
        res.send({
            onlines: onlines
        });
});

//聊天室
router.get('/group_chat', function (req, res) {
    var username = req.session.name;
    res.render('chatRoom/room.html',{master:username});
});



module.exports = router;
