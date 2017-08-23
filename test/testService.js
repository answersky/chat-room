/**
 * Created by Administrator on 2017/6/23.
 */
var async = require('async');
var authorService = require("../service/authorityService");
var action = require("../dao/userActionDao");

/*authorService.validateAuthority('S005', '0106', function (data) {
    console.log(data);
 });*/


action.findSearchPn('183.49.28.240', function (result) {
    async.map(result.rows, function (item1, callback1) {
        action.findProductByPnAndSupplier(item1.modelname, item1.domain, function (data) {
            callback1(null, data.rows);
        });
    }, function (err, results) {
        console.log(results);
    });
});


var arr = [{name: 'Jack'}, {name: 'Mike'}];
async.map(arr, function (item1, callback1) {
    callback1(null, item1.name);
}, function (err, resultAll) {
    console.log(resultAll);
});
