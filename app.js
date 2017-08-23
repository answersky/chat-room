var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

console.log("server is running!");


var app = express();
//session 设置
app.use(session({
    secret: 'name',
    cookie:{
        maxAge: 1000 * 60 * 60
    },
    resave: true, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
}));

// view engine setupn
app.set('views', path.join(__dirname, 'views'));
app.engine("html",require("ejs").__express);
// app.set('view engine', 'jade');
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// 设置静态资源的目录
app.use(express.static(path.join(__dirname, 'public')));


//拦截器
app.all('/*', function (request, res, next) {
    var jsPattern = /\.js\.css$/;
    var url = request.originalUrl;
    if (jsPattern.test(url)) {
        // 公共部分，放行
        next();
        return;
    }
    console.log("拦截器..........url:" + url);
    if (url == '/login' || url == '/validateLogin' || url == '/logout' ||
         url == '/register'|| url == '/addUser') {
        next();
    } else {
        var username = request.session.name;
        if (username != null && username != '') {
            next();
        } else {
            res.redirect("/login");
        }
    }
});

app.use('/', routes);
app.use('/login',routes); // 即为为路径 /login 设置路由
app.use('/validateLogin', routes); // 即为为路径 /login 设置路由
app.use('/register',routes); // 即为为路径 /register 设置路由
app.use("/logout",routes); // 即为为路径 /logout 设置路由
app.use("/sendEmail",routes); // 即为为路径 /logout 设置路由

//聊天室
app.use('/group_chat',routes);
app.use('/addUser',routes);
app.use('/chatHistory',routes);
app.use('/findOnline',routes);

module.exports = app;
