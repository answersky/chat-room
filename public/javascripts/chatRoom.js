/**
 * Created by Administrator on 2017/6/23.
 */
var chat = angular.module("group-chat", ['ngSanitize']);

chat.controller('chatController', ['$scope', '$http', '$interval', '$location','$timeout',
    function ($scope, $http, $interval, $location,$timeout) {
    //当前登录用户自己
     $scope.master = null;
     $scope.messages=[];
        var ws = io.connect();
        console.log(ws);

        //获取聊天历史
        $http.get('/chatHistory', {
            params: {}
        }).then(function (res) {
            $scope.master=res.data.username;
            $scope.messages=res.data.history;
            ws.emit('login', $scope.master);
            $scope.findOnlines();
        });

        //获取当前在线人员
        $scope.onlines=[];
        $scope.findOnlines=function () {
            $http.get('/findOnline', {
                params: {}
            }).then(function (res) {
                console.log(res.data);
                $scope.onlines=res.data.onlines;
            });
        };


        //监听新会员上线
        $scope.showOrHide=0;
        ws.on('online',function (data) {
            //定时执行函数
            var type=data.type;
            if(type==1){
                $scope.newUser=data.username+"已上线！";
                if($scope.onlines.indexOf(data.username)<0){
                    $scope.onlines.push(data.username);
                }
            }else {
                $scope.newUser=data.username+"已下线！";
                removeByValue($scope.onlines,data.username);
            }
            $scope.showOrHide=1;
            $scope.$apply();
            var timer=$timeout(function(){
                $scope.showOrHide=0;
                $scope.$apply();
            },5000);
        });


        //下线通知
        $scope.offLine=function () {
            ws.emit('offline',$scope.master);
            $http.get('/logout', {
                params: {}
            }).then(function (res) {
                window.location = "/login";
            });
        };

    //判断消息是否有img表签
        $scope.containsImg = function (mes) {
            if (mes.indexOf("<img") >= 0) {
                return true;
            }
            return false;
        };


    //发送消息
    $scope.sendInfo = function () {
        var message = $scope.messageContent;
        if (message != null && message != '') {
            var username = $scope.master;
            var time = new Date().Format("yyyy-MM-dd hh:mm:ss");
            $scope.messageContent = "";

            ws.emit('message', username, message);
        }
        else {
            zdalert("系统提示", '请输入要发送的内容');
        }

    };

        ws.on('sendMessage', function (data) {
            var username = unescape(data.username);
            var message = unescape(data.message);
            var time = new Date().Format("yyyy-MM-dd hh:mm:ss");
            var data = {
                time: time,
                message: message,
                username: username
            };

            $scope.messages.unshift(data);
            $scope.$apply();


        });

        $scope.$on('messagesFinished', function (messagesFinishedEvent) {
            $scope.scrollTop = angular.element("#chat-message")[0].scrollTop;
            $scope.scrollHeight = angular.element("#chat-message")[0].scrollHeight;
            setScroll("chat-message", $scope.scrollHeight);
        });

    }]);

chat.directive('onFinishMessageFilters', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('messagesFinished');
                });
            }
        }
    };
});


//移除数组指定元素
function removeByValue(arr, val) {
    for(var i=0; i<arr.length; i++) {
        if(arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}