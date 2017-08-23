/**
 * Created by Administrator on 2017/6/22.
 */
//验证客服查询的权限
var cusDao = require("../dao/customerDao");
var authorityDao = require("../dao/authorityDao");

/*var config = {
 info: 0102,//基本信息 0102
 order: 0105,//订单信息 0105
 searchModel: 0103,//搜索型号 0103
 visitorLink: 0104//访问链接 0104

 };*/

module.exports = {
    validateAuthority: function (username, type, cb) {
        cusDao.queryCusInfo(username, function (data) {
            if (data.rows.length > 0) {
                var authority = data.rows[0].authority_detail;
                var status = data.rows[0].status;
                if (status == '0') {
                    cb(false);
                } else {
                    authority = JSON.parse(authority);
                    authorityDao.findAuthorityByNum(authority, function (result) {
                        var arr = new Array();
                        var re = result.rows;
                        for (var i in re) {
                            var auth = re[i].number;
                            arr.push(auth);
                        }
                        if (arr.indexOf(type) >= 0) {
                            cb(true);
                        } else {
                            cb(false);
                        }

                    })
                }

            }

        })
    }
};