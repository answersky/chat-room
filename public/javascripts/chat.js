/**
 * Created by answer on 2017/6/20.
 */
var ws, mesTo, mesToIp, user;
$(function () {
    // var host = $("#host").text();
    // ws = io.connect(host);
    // ws.on('info', function (data) {
    //     console.log(data);
    // });
    //
    user = $("#username").val();
    // ws.emit('login', username);

    //发送图片
    img(ws, user);

    /* $("#sendMessage").click(function () {
        var messageTo = $("#messageTo").val();
        var ip = $("#ip").val();
        sendMssage(ws, username, messageTo, ip);

     });*/

    //enter回车发送消息
    /*  $("#message").keydown(function (e) {
        var messageTo = $("#messageTo").val();
        var ip = $("#ip").val();
        if (e.which == 13) {
            sendMssage(ws, username, messageTo, ip);
        }
     });*/

    $(".start").mouseenter(function () {
        var id = $(this).attr("id");
        console.log(id);
        score(id);

    });

    // ws.on('to' + username, function (data) {
    //     var messageTo = $("#messageTo").val();
    //     var mes = unescape(data.message);
    //     var timestamp = new Date().getTime();
    //     var time = new Date().Format("yyyy-MM-dd hh:mm:ss");
    //
    //     var html = '<div class="media-body"><h6 class="media-heading">' + messageTo +
    //         '<small class="helper-font-small">&nbsp;&nbsp;&nbsp;' + time + '</small></h6>' +
    //         '<p class="talk-box color-blanchedalmond" id="mess_' + timestamp + '"></p></div>';
    //     $("#recent").append(html);
    //     if (mes.indexOf('<img') < 0) {
    //         $("#mess_" + timestamp).text(mes);
    //     } else {
    //         $("#mess_" + timestamp).html(mes);
    //     }
    //     scrollBottom("recent");
    // });
});

//发送消息
// function sendMssage(ws, username, messageTo, ip) {
//     var message = $("#message").val();
//     if (message != null && message != '') {
//         //清空输入框
//         $("#message").val('');
//         //将自己的消息放到聊天框中
//         message = unescape(message);
//         var timestamp = new Date().getTime();
//         var time = new Date().Format("yyyy-MM-dd hh:mm:ss");
//         /*var html = '<div class="media-body text_r"><h6 class="media-heading text_r">' + username +
//             '<small class="helper-font-small">&nbsp;&nbsp;&nbsp;' + time + '</small></h6>' +
//             '<p class="talk-box float_r text_l color-aliceblue" id="mess_' + timestamp + '"></p></div>';
//         $("#recent").append(html);
//          $("#mess_" + timestamp).text(message);*/
//         scrollBottom("recent");
//         ws.emit('message', username, messageTo, message, ip);
//     } else {
//         zdalert("系统提示", "请输入要发送的内容");
//     }
//
// }

//评分
function score(id) {
    var step = +id.replace("start_", "");
    for (var i = step; i >= 1; i--) {
        $("#start_" + i).removeClass("icofont-star-empty");
        $("#start_" + i).addClass("icofont-star");
    }
    for (var i = step + 1; i <= 5; i++) {
        $("#start_" + i).removeClass("icofont-star");
        $("#start_" + i).addClass("icofont-star-empty");
    }
}

function addScore() {
    var arr = $(".icofont-star");
    console.log(arr.length);
    var score = arr.length;
    var username = $("#username").val();
    var customerNumber = $("#messageTo").val();
    $.ajax({
        url: '/score/checkExits',
        type: 'post',
        async: false,
        data: {
            username: username,
            customerNumber: customerNumber
        },
        success: function (data) {
            console.data;
            if (data == 'false') {
                submitScore(username, customerNumber, score);
                $("#scoreSubmit").attr("disabled", true);
            } else {
                zdalert("系统提示", "请勿在同一天对同一客服重复评价！");
            }
        }
    });
}

function submitScore(username, customerNumber) {
    var arr = $(".icofont-star");
    console.log(arr.length);
    var score = arr.length;
    $.ajax({
        url: '/score/submitScore',
        type: 'post',
        async: false,
        data: {
            username: username,
            customerNumber: customerNumber,
            score: score
        },
        success: function (data) {
            console.data;
            zdalert("系统提示", "评分成功！");
        }
    });
}

function img(ws, username) {
    //查找box元素,检测当粘贴时候,
    document.querySelector('#message').addEventListener('paste', function (e) {
        var messageTo = mesTo;
        var ip = mesToIp;
        console.log(mesTo + ":" + mesToIp);
        //判断是否是粘贴图片
        if (e.clipboardData && e.clipboardData.items[0].type.indexOf('image') > -1) {
            var reader = new FileReader();
            var file = e.clipboardData.items[0].getAsFile();
            reader.onload = function (event) {
                // event.target.result 即为图片的Base64编码字符串
                var base64_str = event.target.result;
                var mes = "<img width='300' height='400' src='" + base64_str + "'>";
                var timestamp = new Date().getTime();
                var time = new Date().Format("yyyy-MM-dd hh:mm:ss");
                // var html = '<div class="media-body text_r"><h6 class="media-heading text_r">' + username +
                //     '<small class="helper-font-small">&nbsp;&nbsp;&nbsp;' + time + '</small></h6>' +
                //     '<p class="talk-box float_r text_l color-aliceblue" id="mess_' + timestamp + '"></p></div>';
                // $("#recent").append(html);
                // $("#mess_" + timestamp).html(mes);
                scrollBottom("recent");
                ws.emit('message', username, messageTo, mes, ip, null);
                ws.emit('message', username, messageTo, mes, ip, messageTo);

            };
            reader.readAsDataURL(file);
        }
    }, false);
}
