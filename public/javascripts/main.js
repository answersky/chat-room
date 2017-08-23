/**
 * Created by Administrator on 2017/6/23.
 */
var customer = angular.module("customer", ['ngSanitize']);

customer.controller('customerController', ['$scope', '$http', '$interval', '$location',
    function ($scope, $http, $interval, $location) {
        //联系人
    $scope.contacts = [];
    $scope.onliners = [];
    $scope.username = null;
        var userchat = angular.element("#username").text();
    $scope.description = null;
    $scope.firstContact = {};
    $scope.num = 0;
    $scope.score = [];
        ws = io.connect();
        console.log(ws);
        ws.on('info', function (data) {
            console.log(data);
        });
        console.log("user============>" + userchat);

        $http.get('/contacts', {
            params: {}
        }).then(function (res) {
            console.log(res.data);
            $scope.username = res.data.username;

            $scope.description = res.data.description;
            $scope.onliners = res.data.onliners;
            ws.emit('login', $scope.username);
            var score = res.data.score;
            for (var i = 0; i < score; i++) {
                $scope.score.push(i);
            }
            var contactArr = res.data.contacts;
            for (var i in contactArr) {
                var userInfo = contactArr[i];
                var infos = userInfo.split(">");
                var user = infos[0];
                var ip = infos[2];
                var time = new Date(infos[1]).Format("yyyy-MM-dd hh:mm:ss");
                var contact = {name: user, ip: ip, time: time};
                $scope.contacts.push(contact);

                if (i == 0) {
                    $scope.firstContact.to = user;
                    $scope.firstContact.from = $scope.username;
                    $scope.firstContact.ip = ip;
                    mesTo = user;
                    mesToIp = ip;
                    $scope.findMessage();
                    $scope.findQuestions();
                    $scope.findOrder();
                    $scope.findVisitor();
                    $scope.findPns();
                    $scope.baseInfo();
                }
            }
        });

    //查询第一个的聊天记录
    $scope.findMessage = function () {
        $http({
            method: 'POST',
            url: '/findFirstMessage',
            data: {
                from: $scope.firstContact.from,
                to: $scope.firstContact.to
            }
        }).then(function (response) {
            console.log(response.data);
            if (response.data != null) {
                $scope.firstContact.messages = response.data;
            } else {
                $scope.firstContact.messages = [];
            }
        })
    };

        $scope.$watch('nowChatContact.messages', function () {
            scrollBottom("recent");
        });

    //基本信息
    $scope.baseInfo = function () {
        $http({
            method: 'GET',
            url: '/findBaseInfo',
            params: {
                username: $scope.firstContact.from,
                messageTo: $scope.firstContact.to,
                ip: $scope.firstContact.ip
            }
        }).then(function (response) {
            $scope.userShow = response.data.userShow;
            if (response.data.user != null) {
                $scope.userInfo = response.data.user;
            } else {
                $scope.userInfo = {};
            }
        })
    };


    //查询问题
    $scope.findQuestions = function () {
        $http({
            method: 'GET',
            url: '/findQuestions',
            params: {}
        }).then(function successCallback(response) {
            var result = response.data;
            $scope.firstContact.questions = result;
        }, function errorCallback(response) {
            // 请求失败执行代码
            console.log("error");
        });
    };

//判断消息是否有img表签
        $scope.containsImg = function (mes) {
            if (mes.indexOf("<img") >= 0) {
                return true;
            }
            return false;
        };

    //查询积分订单
    $scope.findOrder = function () {
        $http({
            method: 'GET',
            url: '/findOrders',
            params: {
                username: $scope.firstContact.from,
                messageTo: $scope.firstContact.to,
                ip: $scope.firstContact.ip
            }
        }).then(function successCallback(response) {
            $scope.showOrder = response.data.orderShow;
            if (response.data.result != null) {
                $scope.orders = response.data.result;
            } else {
                $scope.orders = [];
            }

        }, function errorCallback(response) {
            // 请求失败执行代码
            console.log("error");
        });
    };

    //查看搜索型号
    $scope.findPns = function () {
        $http({
            method: 'GET',
            url: '/findSearchPn',
            params: {
                username: $scope.firstContact.from,
                messageTo: $scope.firstContact.to,
                ip: $scope.firstContact.ip
            }
        }).then(function successCallback(response) {
            $scope.pnShow = response.data.pnShow;
            console.log("========>" + $scope.pnShow);
            $scope.pnInfos = new Array();
            var pns = response.data.result;
            if (pns != null && pns.length > 0) {
                for (var i in pns) {
                    if (pns[i].length > 0) {
                        $scope.pnInfos.push(pns[i][0]);
                    }
                }
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            console.log("error");
        });
    };


    //查看访问链接
    $scope.findVisitor = function () {
        $http({
            method: 'GET',
            url: '/findVisitorSite',
            params: {
                username: $scope.firstContact.from,
                messageTo: $scope.firstContact.to,
                ip: $scope.firstContact.ip
            }
        }).then(function successCallback(response) {
            $scope.visitorShow = response.data.visitorShow;
            if (response.data.result != null) {
                $scope.links = response.data.result;
            } else {
                $scope.links = [];
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
            console.log("error");
        });
    };



    //发送消息
    $scope.sendInfo = function () {
        console.log(ws);
        var message = $scope.messageContent;

        if (message != null && message != '') {
            var username = $scope.username;
            var messageTo = $scope.firstContact.to;
            var ip = $scope.firstContact.ip;
            var time = new Date().Format("yyyy-MM-dd hh:mm:ss");
            var data = {
                create_time: time,
                message: message,
                receive: messageTo,
                send: username,
                update_time: time
            };
            $scope.firstContact.messages.unshift(data);
            $scope.messageContent = "";
            // sendMssage(ws, username, messageTo, ip);
            // $scope.bottomScorll();
            // $scope.scrollBottom.scrollTop = $scope.scrollBottom.scrollHeight;

            ws.emit('message', username, messageTo, message, ip, null);
        }
        else {
            zdalert("系统提示", '请输入要发送的内容');
        }

    };

        //监听用户正在输入
        $scope.listenInput = function (type) {
            var username = $scope.username;
            var messageTo = $scope.firstContact.to;
            ws.emit('listenInput', username, messageTo, type);
        };


        //切换聊天窗口
    $scope.changContact = function (to, ip, num) {
        //切换样式
        $scope.num = num;
        //清除聊天框内容
        angular.element("#recent").innerHTML = '';

        //赋值
        mesTo = to;
        mesToIp = ip;

        $scope.firstContact.to = to;
        $scope.firstContact.ip = ip;

        var key = $scope.key;
        if (key != null && key.trim() != '') {
            $scope.findMessageByKey(key);
        } else {
            $scope.findMessage();
        }

        $scope.findQuestions();
        $scope.findOrder();
        $scope.findVisitor();
        $scope.findPns();
        $scope.baseInfo();
    };

    //查询聊天信息
    $scope.filterMessage = function () {
        //清除聊天框内容
        angular.element("recent").innerHTML = '';
        var key = $scope.key;
        if (key == null || key.trim() == '') {
            window.location.reload();
        } else {
            $http({
                method: 'POST',
                url: '/filterMessage',
                data: {
                    message: key
                }
            }).then(function (res) {
                $scope.onliners = res.data.onliners;
                var contactArr = res.data.contacts;
                $scope.num = 0;
                if (contactArr.length > 0) {
                    $scope.contacts = [];
                    for (var i in contactArr) {
                        var userInfo = contactArr[i];
                        var infos = userInfo.split(">");
                        var user = infos[0];

                        var ip = infos[2];
                        var time = new Date(infos[1]).Format("yyyy-MM-dd hh:mm:ss");
                        var contact = {name: user, ip: ip, time: time};
                        $scope.contacts.push(contact);
                        if (i == 0) {
                            $scope.firstContact.to = user;
                            $scope.firstContact.from = $scope.username;
                            $scope.firstContact.ip = ip;
                            mesTo = user;
                            mesToIp = ip;
                            $scope.findMessageByKey(key);
                            $scope.findQuestions();
                            $scope.findOrder();
                            $scope.findVisitor();
                            $scope.findPns();
                            $scope.baseInfo();

                        }
                    }
                } else {
                    $scope.contacts = [];
                    $scope.userInfo = {};
                    $scope.orders = [];
                    $scope.pnInfos = [];
                    $scope.links = [];
                    $scope.firstContact = {};
                }

            });
        }

    };

    //查询筛选后的消息
    $scope.findMessageByKey = function (key) {
        $http({
            method: 'POST',
            url: '/findMessageByKey',
            data: {
                from: $scope.firstContact.from,
                to: $scope.firstContact.to,
                key: key
            }
        }).then(function (response) {
            console.log(response.data);
            if (response.data != null) {
                $scope.firstContact.messages = response.data;
            } else {
                $scope.firstContact.messages = [];
            }
        })
    };

    $scope.isShow = function (user) {
        if ($scope.onliners.indexOf(user) >= 0) {
            return true;
        } else {
            return false;
        }
    };
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            //下面是在table render完成后执行的js
            console.log("我在页面加载完执行");
            console.log($scope.username);
            ws.on('to' + $scope.username, function (data) {
                var username = unescape(data.from);
                var message = unescape(data.message);
                var messageTo = unescape(data.to);
                var ip = $scope.firstContact.ip;
                var myself = unescape(data.myself);
                if (myself != "null") {
                    messageTo = myself;
                }
                var time = new Date().Format("yyyy-MM-dd hh:mm:ss");
                var data = {
                    create_time: time,
                    message: message,
                    receivce: messageTo,
                    send: username,
                    update_time: time
                };
                if ((myself == "null" && username == $scope.firstContact.to) || myself == $scope.firstContact.to) {
                    $scope.firstContact.messages.unshift(data);
                }
                $scope.$apply();
                console.log($scope.firstContact.messages);

            });


            ws.on('input' + $scope.username, function (data) {
                $scope.inputType = data;
            })
        });
        $scope.$on('messagesFinished', function (messagesFinishedEvent) {
            //下面是在table render完成后执行的js
            console.log("我在聊天的加载完执行");
            $scope.scrollTop = angular.element("#recent")[0].scrollTop;
            $scope.scrollHeight = angular.element("#recent")[0].scrollHeight;
            setScroll("recent", $scope.scrollHeight);

        });


    }]);

customer.directive('onFinishRenderFilters', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    };
});

customer.directive('onFinishMessageFilters', function ($timeout) {
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
