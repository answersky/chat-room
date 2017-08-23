/**
 * Created by Administrator on 2017/6/21.
 */
//左边联系人操作

$(function () {
    //获取当前用户的所有联系人
    var contacts = $('#contacts').val();
    var onlines = $('#onlines').val();
    if (contacts != null && contacts != '') {
        var arr = contacts.split(",");
        var onlinesArr = onlines.split(",");
        var users = new Array();
        var ipObj = {};
        for (var i in arr) {
            var userInfo = arr[i];
            var infos = userInfo.split("@");
            var user = infos[0];
            var ip = infos[2];
            ipObj[user] = ip;
            users.push(user);
            var time = new Date(infos[1]).Format("yyyy-MM-dd hh:mm:ss");
            var html = "";
            if (i == 0) {
                if (onlinesArr.indexOf(user) >= 0) {
                    //在线
                    html = '<li class="links contact-alt grd-white active"><a href="javascript:void(0)" class="linker"> ' +
                        '<div class="contact-item"> <div class="pull-left">' +
                        '<img class="contact-item-object" style="width: 32px;height: 32px;" src="/img/user-thumb-mini.jpg" alt=""/> ' +
                        '</div> <div class="contact-item-body"> <div class="status" title="busy">' +
                        '<i class="icofont-certificate color-green"></i></div> ' +
                        '<p class="contact-item-heading contactName">' + user + '</p> <p class="help-block"> ' +
                        '<small class="muted">' + time + '</small> </p> </div> </div> </a></li>';
                } else {
                    html = '<li class="links contact-alt grd-white active"><a href="javascript:void(0)" class="linker"> ' +
                        '<div class="contact-item"> <div class="pull-left">' +
                        '<img class="contact-item-object" style="width: 32px;height: 32px;" src="/img/user-thumb-mini.jpg" alt=""/> ' +
                        '</div> <div class="contact-item-body"> <div class="status" title="busy">' +
                        '<i class="icofont-certificate color-silver-dark"></i></div> ' +
                        '<p class="contact-item-heading contactName">' + user + '</p> <p class="help-block"> ' +
                        '<small class="muted">' + time + '</small> </p> </div> </div> </a></li>';
                }

            } else {
                if (onlinesArr.indexOf(user) >= 0) {
                    //在线
                    html = '<li class="links contact-alt grd-white"><a href="javascript:void(0)" class="linker"> ' +
                        '<div class="contact-item"> <div class="pull-left">' +
                        '<img class="contact-item-object" style="width: 32px;height: 32px;" src="/img/user-thumb-mini.jpg" alt=""/> ' +
                        '</div> <div class="contact-item-body"> <div class="status" title="busy">' +
                        '<i class="icofont-certificate color-green"></i></div> ' +
                        '<p class="contact-item-heading contactName">' + user + '</p> <p class="help-block"> ' +
                        '<small class="muted">' + time + '</small> </p> </div> </div> </a></li>';
                } else {
                    html = '<li class="links contact-alt grd-white"><a href="javascript:void(0)" class="linker"> ' +
                        '<div class="contact-item"> <div class="pull-left">' +
                        '<img class="contact-item-object" style="width: 32px;height: 32px;" src="/img/user-thumb-mini.jpg" alt=""/> ' +
                        '</div> <div class="contact-item-body"> <div class="status" title="busy">' +
                        '<i class="icofont-certificate color-silver-dark"></i></div> ' +
                        '<p class="contact-item-heading contactName">' + user + '</p> ' +
                        '<p class="help-block"> ' +
                        '<small class="muted">' + time + '</small> </p> </div> </div> </a></li>';
                }

            }
            $("#contact-list").append(html);
        }


        firstContactMessage(users[0], ipObj[users[0]]);

        //初始化切换聊天框
        $("a.linker").each(function () {
            $(this).click(function () {
                //移除所有选中的样式
                $("li.links").each(function () {
                    $(this).removeClass("active");
                });

                //给当前添加选中样式
                $(this).parent("li").addClass("active");
                var linker = $(this).find("p.contactName").text();
                console.log(linker + ":" + ipObj[linker]);
                firstContactMessage(linker, ipObj[linker]);
            })
        })
    }

});

//加载第一次展示第一个联系人的聊天信息
function firstContactMessage(contact, ip) {
    //修改聊天框信息
    $("#contact_user strong").text(contact);
    var id = contact.replace(/./g, "");
    $("div.corner-all-content").attr("id", "recent_" + id);
    $("#messageTo").val(contact);
    $("#ip").val(ip);

    //清空聊天框
    $("#recent_" + id).empty();

    var username = $('#username').val();
    var data = {from: username, to: contact};
    $.ajax({
        url: '/findFirstMessage',
        type: 'post',
        async: false,
        data: data,
        success: function (data) {
            if (data.length > 0) {
                for (var i = data.length - 1; i >= 0; i--) {
                    var from = data[i].send;
                    var message = data[i].message;
                    var time = data[i].create_time;
                    time = new Date(time).Format("yyyy-MM-dd hh:mm:ss");
                    var timestamp = new Date().getTime();
                    if (from == username) {
                        //自己的消息
                        var html = '<div class="media-body text_r"><h6 class="media-heading text_r">' + from +
                            '<small class="helper-font-small">&nbsp;&nbsp;&nbsp;' + time + '</small></h6>' +
                            '<p class="talk-box float_r text_l color-aliceblue" id="mess_' + timestamp + '"></p></div>';
                        messageInfo(html, message, id, timestamp);

                    } else {
                        // 对方的消息
                        var html = '<div class="media-body"><h6 class="media-heading">' + contact +
                            '<small class="helper-font-small">&nbsp;&nbsp;&nbsp;' + time + '</small></h6>' +
                            '<p class="talk-box color-blanchedalmond" id="mess_' + timestamp + '"></p></div>';
                        messageInfo(html, message, id, timestamp);
                    }
                    scrollBottom("recent_" + id);
                }
            }
        }
    });
}

function messageInfo(html, message, id, timestamp) {
    $("#recent_" + id).append(html);
    if (message.indexOf('<img') < 0) {
        console.log(message);
        $("#mess_" + timestamp).text(message);
    } else {
        $("#mess_" + timestamp).html(message);
    }
}