/**
 * Created by Administrator on 2017/6/23.
 */
function orderInfo($scope, $http) {
    // var username = $("#username").val();
    var messageTo = $("#messageTo").val();
    var ip = $("#ip").val();
    console.log("积分订单................." + username + "=>" + messageTo + "=>" + ip);
    $http({
        method: 'GET',
        url: '/findOrders',
        params: {
            username: username,
            messageTo: messageTo,
            ip: ip
        }
    }).then(function successCallback(response) {
        var result = response.data;
        console.log(result);
    }, function errorCallback(response) {
        // 请求失败执行代码
        console.log("error");
    });
}