/**
 * Created by xcy on 2017/6/23.
 */
customer.controller('userController', [
    '$scope',
    '$http',
    '$interval',
    '$filter',
    '$location',
    function ($scope, $http, $filter, $interval, $location) {
        //获取链接中的参数
        {
            var host = $location.host();
            var port = $location.port();
            var url = host + ":" + port;
            ws = io.connect();
            console.log(ws);
            ws.on('info', function (data) {
                console.log(data);
            });
            
            var str = $location.absUrl();
            console.log("ws");
            console.log(ws);
            var username, ip, customerNumber;
            if (str.indexOf("#") > 0) {
                str = str.substr(0, str.indexOf("#"));
            }

            var num = str.indexOf("?");
            var name, value;
            str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

            var arr = str.split("&"); //各个参数放到数组里
            for (var i = 0; i < arr.length; i++) {
                num = arr[i].indexOf("=");
                if (num > 0) {
                    name = arr[i].substring(0, num);
                    value = arr[i].substr(num + 1);
                    if (name == 'username') {
                        username = value;
                    } else if (name == 'ip') {
                        ip = value;
                    } else if (name == 'customerNumber') {
                        customerNumber = value;
                    }
                }
            }


            if (username == null || username == '') {
                username = ip;
            }
            //初始化聊天人的信息
            $scope.nowChatContact = {};
            $scope.nowChatContact.messages = [];

            ws.emit('login', username);
            ws.on('to' + username, function (data) {
                var username = unescape(data.from);
                var message = unescape(data.message);
                var messageTo = unescape(data.to);
                var myself = unescape(data.myself);
                var ip = $scope.nowChatContact.ip;
                var time = new Date().Format("yyyy-MM-dd hh:mm:ss");
                var data = {
                    create_time: time,
                    message: message,
                    receive: messageTo,
                    send: username,
                    update_time: time
                };
                if ((myself == "null" && username == $scope.nowChatContact.to) || myself == $scope.nowChatContact.to) {
                    $scope.nowChatContact.messages.unshift(data);
                }
                $scope.$apply();
                console.log($scope.nowChatContact.messages);

            });

            ws.on('input' + username, function (data) {
                $scope.inputType = data;
            });

            console.log("userName:" + username + "\tip :" + ip);
            $scope.username = username;
            $scope.customerNumber = angular.element("#customerNumber").val();
            $scope.ip = ip;
            $scope.userInfo = {};
            $scope.pnInfos = new Array;
            $scope.isLogin = false;
        }

        $scope.contacts = [];
        $scope.onliners = [];
        //初始化聊天的权重
        $scope.chatStep = 0;

        //获取联系人的方法
        $scope.findUserContacts = function () {
            $http.get('/users', {
                params: {
                    username: $scope.username,
                    customerNumber: $scope.customerNumber,
                    ip: $scope.ip
                }
            }).then(function (res) {
                console.log(res.data);
                $scope.isLogin = res.data.isLogin;
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
                        $scope.nowChatContact.to = user;
                        $scope.nowChatContact.from = $scope.username;
                        $scope.nowChatContact.ip = ip;
                        mesTo = user;
                        mesToIp = ip;
                        if ($scope.isLogin) {
                            $scope.findMessage();
                        }
                        $scope.findNowChatContact();
                        $scope.findQuestions();
                    }
                }

                $scope.onliners = res.data.onliners;
            });
        };
        $scope.findUserContacts();
        //判断是否在线的方法
        $scope.isShow = function (user) {
            if ($scope.onliners.indexOf(user) >= 0) {
                return true;
            } else {
                return false;
            }
        };

        $scope.findMessage = function () {
            if ($scope.isLogin) {
                $http({
                    method: 'POST',
                    url: '/findFirstMessage',
                    data: {
                        from: $scope.nowChatContact.from,
                        to: $scope.nowChatContact.to
                    }
                }).then(function (response) {
                    console.log(response.data);
                    var data = response.data;
                    if (data != null) {
                        $scope.nowChatContact.messages = response.data;
                    } else {
                        $scope.nowChatContact.messages = {};
                    }
                })
            }

        };

        //查询对应客服的描述和评分
        $scope.findNowChatContact = function () {
            $http({
                method: 'POST',
                url: '/user/findCustomerInfo',
                data: {
                    customerNumber: $scope.nowChatContact.to
                }
            }).then(function (response) {
                console.log(response.data);
                var data = response.data;
                if (data != null) {
                    var score = response.data.score;
                    $scope.nowChatContact.description = response.data.description;
                    $scope.nowChatContact.score = [];
                    for (var i = 0; i < score; i++) {
                        $scope.nowChatContact.score.push(i);
                    }

                } else {
                    $scope.nowChatContact.score = [];
                    $scope.nowChatContact.description = "";
                }
            })
        };
        
        $scope.changeChat = function (index, to) {
            $scope.nowChatContact.to = to;
            $scope.nowChatContact.messages = "";
            var key = $scope.key;
            $scope.findNowChatContact();
            if (key != null && key.trim() != '') {
                $scope.findMessageByKey(key);
            } else {
                $scope.findMessage();
            }
            $scope.chatStep = index;
            //赋值
            mesTo = to;
            mesToIp = $scope.ip;


        };

        //发送消息
        $scope.sendInfo = function () {
            console.log(ws);
            var username = $scope.username;
            var message = $scope.messageContent;

            if (message != null && message != '') {
                var messageTo = $scope.nowChatContact.to;
                var ip = $scope.nowChatContact.ip;
                var time = new Date().Format("yyyy-MM-dd hh:mm:ss");
                var data = {
                    create_time: time,
                    message: message,
                    receive: messageTo,
                    send: username,
                    update_time: time
                };
                $scope.nowChatContact.messages.unshift(data);
                console.log($scope.nowChatContact.messages);
                $scope.messageContent = "";
                // sendMssage(ws, username, messageTo, ip);
                ws.emit('message', username, messageTo, message, ip, null);
            } else {
                zdalert("系统提示", '请输入要发送的内容');
            }


        };


        //监听用户正在输入
        $scope.listenInput = function (type) {
            var username = $scope.username;
            var messageTo = $scope.nowChatContact.to;
            ws.emit('listenInput', username, messageTo, type);
        };

        //判断消息是否有img表签
        $scope.containsImg = function (mes) {
            if (mes.indexOf("<img") >= 0) {
                return true;
            }
            return false;
        };

        //提交评分信息
        $scope.addNewScore = function () {
            username = $scope.nowChatContact.from;
            customerNumber = $scope.nowChatContact.to;
            $http({
                method: 'POST',
                url: '/score/checkExits',
                data: {
                    username: username,
                    customerNumber: customerNumber
                }
            }).then(function (response) {
                console.log(response.data);
                var data = response.data;
                if (data == 'false') {
                    submitScore(username, customerNumber);
                    $("#scoreSubmit").attr("disabled", true);
                } else {
                    zdalert("系统提示", "请勿在同一天对同一客服重复评价！");
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
                $scope.nowChatContact.questions = result;
            }, function errorCallback(response) {
                // 请求失败执行代码
                console.log("error");
            });
        };

        //获取对应的用户信息
        $scope.findUserInfo = function () {
            $http({
                method: 'POST',
                url: '/user/findUserInfo',
                data: {
                    username: $scope.username,
                    ip: $scope.ip
                }
            }).then(function successCallback(response) {
                // var result = response.data;
                $scope.userInfo = response.data.user;
                console.log(response.data);
                console.log($scope.userInfo);
            }, function errorCallback(response) {
                // 请求失败执行代码
                console.log("error");
            });
        };
        $scope.findUserInfo();

        //查询积分订单
        $scope.findOrder = function () {
            $http({
                method: 'POST',
                url: '/user/findOrders',
                data: {
                    username: $scope.username
                }
            }).then(function successCallback(response) {
                $scope.orders = response.data.result;
                console.log(response.data.result);
            }, function errorCallback(response) {
                // 请求失败执行代码
                console.log("error");
            });
        };
        $scope.findOrder();

        //查看搜索型号
        $scope.findPns = function () {
            $http({
                method: 'GET',
                url: '/user/findSearchPn',
                params: {
                    ip: $scope.ip
                }
            }).then(function successCallback(response) {
                $scope.pnInfos = new Array();
                var pns = response.data.result;

                if (pns != null) {
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
        $scope.findPns();


        //查看访问链接
        $scope.findVisitor = function () {
            $http({
                method: 'GET',
                url: '/user/findVisitorSite',
                params: {
                    ip: $scope.ip
                }
            }).then(function successCallback(response) {
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
        $scope.findVisitor();

        //查询聊天信息
        $scope.filterMessage = function () {
            if (!$scope.isLogin) {
                window.location.href = "/login";
            }
            var key = $scope.key;
            if (key == null || key.trim() == '') {
                window.location.reload();
            } else {
                $http({
                    method: 'POST',
                    url: '/user/filterMessage',
                    data: {
                        message: key,
                        username: $scope.username
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
                                $scope.nowChatContact.to = user;
                                $scope.nowChatContact.from = $scope.username;
                                $scope.nowChatContact.ip = ip;
                                mesTo = user;
                                mesToIp = ip;
                                $scope.findMessageByKey(key);
                                $scope.findQuestions();
                                $scope.findOrder();
                                $scope.findVisitor();
                                $scope.findPns();
                                $scope.findUserInfo();

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
                url: '/user/findMessageByKey',
                data: {
                    from: $scope.nowChatContact.from,
                    to: $scope.nowChatContact.to,
                    key: key
                }
            }).then(function (response) {
                console.log(response.data);
                if (response.data != null) {
                    $scope.nowChatContact.messages = response.data;
                } else {
                    $scope.nowChatContact.messages = [];
                }
            })
        };

        $scope.$on('messagesFinished', function (messagesFinishedEvent) {
            //下面是在table render完成后执行的js
            console.log("我在聊天的加载完执行");
            $scope.scrollTop = angular.element("#recent")[0].scrollTop;
            $scope.scrollHeight = angular.element("#recent")[0].scrollHeight;
            setScroll("recent", $scope.scrollHeight);

        });
        
    }
]);


customer.factory('findMessage', [
    '$http',
    function ($http) {
        var service = {};
        var from = '';
        var to = '';
        service.setFrom = function (from) {
            from = from;
        };
        service.getFrom = function () {
            return from;
        };
        service.setTo = function (to) {
            to = to;
        };
        service.getTo = function () {
            return to;
        };
        service.findMessage = function () {
            $http({
                method: 'POST',
                url: '/findFirstMessage',
                data: {
                    from: from,
                    to: to
                }
            }).then(function (response) {
                console.log(response.data);
                return response.data;
            })
        }
        return service;
    }
]);

customer.factory('findContacts', [
    '$http',
    function ($http) {
        var service = {};
        var customerNumber = '';
        var username = '';
        var ip = '';
        service.setCustomerNumber = function (customerNumber) {
            customerNumber = customerNumber;
        };
        service.getCustomerNumber = function () {
            return customerNumber;
        };
        service.setIp = function (ip) {
            ip = ip;
        };
        service.getIp = function () {
            return ip;
        };

        service.setUsername = function (username) {
            username = username;
        };
        service.getUsername = function () {
            return username;
        };
        service.findContacts = function () {
            if (customerNumber == '') {
                service.findCustomerContacts();
            } else {
                service.findUserContacts();
            }

        };

        service.findCustomerContacts = function () {
            $http.get('/contacts', {
                params: {}
            }).then(function (res) {
                console.log(res.data);
                return res.data;
            });
        };
        service.findUserContacts = function () {
            $http.get('/users', {
                params: {}
            }).then(function (res) {
                console.log(res.data);
                return res.data;
            });
        }
        return service;
    }
]);
