/**
 * Created by Administrator on 2017/6/23.
 */
function questionModular($scope, $http) {
    $http({
        method: 'GET',
        url: '/findQuestions',
        params: {}
    }).then(function successCallback(response) {
        var result = response.data;
        $scope.questions = result;
    }, function errorCallback(response) {
        // 请求失败执行代码
        console.log("error");
    });
}