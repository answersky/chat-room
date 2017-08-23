/**
 * Created by Administrator on 2017/6/21.
 */
//左边联系人操作

$(function () {
    var contact = $("#messageTo").val();
    $("#contact_user strong").text(contact);
    $("div.corner-all-content").attr("id", "recent_" + contact);
    $("#messageTo").val(contact);
    //清空聊天框
    $("#recent_" + contact).empty();
    var nowDate = new Date().format("yyyy-MM-dd hh:mm:ss");
    $("#nowDate").text(nowDate);
    firstContactMessage(contact);

});
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}


function messageInfo(html, message, contact, timestamp) {
    $("#recent_" + contact).append(html);
    if (message.indexOf('<img') < 0) {
        $("#mess_" + timestamp).text(message);
    } else {
        $("#mess_" + timestamp).html(message);
    }
}

//加载与客服的聊天信息
function firstContactMessage(contact) {
    var username = $('#username').val();
    var data = {from: username, to: contact};
    $.ajax({
        url: '/findFirstMessage',
        type: 'post',
        async: false,
        data: data,
        success: function (res) {
            if (res.length > 0) {
                for (var i in res) {
                    var from = res[i].send;
                    var message = res[i].message;
                    var time = res[i].create_time;
                    time = new Date(time).Format("yyyy-MM-dd hh:mm:ss");
                    console.log(message);
                    var timestamp = new Date().getTime();
                    if (from == username) {
                        //自己的消息
                        var html = '<div class="media-body text_r"><h6 class="media-heading text_r">' + from +
                            '<small class="helper-font-small">&nbsp;&nbsp;&nbsp;' + time + '</small></h6>' +
                            '<p class="talk-box float_r text_l color-aliceblue" id="mess_' + timestamp + '"></p></div>';
                        messageInfo(html, message, contact, timestamp);

                    } else {
                        // 对方的消息
                        var html = '<div class="media-body"><h6 class="media-heading">' + contact +
                            '<small class="helper-font-small">&nbsp;&nbsp;&nbsp;' + time + '</small></h6>' +
                            '<p class="talk-box color-blanchedalmond" id="mess_' + timestamp + '"></p></div>';
                        messageInfo(html, message, contact, timestamp);
                    }
                    scrollBottom("recent_" + contact);
                }
            }
        }
    });
}