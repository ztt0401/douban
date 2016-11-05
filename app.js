(function() {

    /**
     * doubanApp Module
     *
     * Description
     */
    var doubanApp = angular.module('doubanApp', ['ngRoute', 'doubanApp.detail', 'doubanApp.listModule']);

    //路由  每个模块的路由单独放到子模块中配置
    doubanApp.config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        otherwise({
            redirectTo: '/in_theaters'
        })
    }])

    //定义一个不变的值
    doubanApp.constant('appConfig', {
        listUrl: "https://api.douban.com/v2/movie/",
        detaiUrl: "https://api.douban.com/v2/movie/subject/",
        pageCount: 5
    })

    doubanApp.directive('search', ['$route', '$routeParams', '$location', '$timeout', function($route, $routeParams, $location, $timeout) {
        // Runs during compile
        return {
            // scope:{},
            replace: true,
            template: '<form  ng-submit="search()" class="navbar-form navbar-right">\
                    <input ng-model="input" type="text" class="form-control" placeholder="Search...">\
                </form>',
            link: function($scope, iElm, iAttrs, controller) {

                $scope.search = function() {

                    if ($routeParams.category) {
                        console.log('列表页');
                        $route.updateParams({ category: 'search', q: $scope.input });
                    } else {
                        // console.log($routeParams);
                        $location.path('search');
                        $timeout(function() {
                            $route.updateParams({ category: 'search', q: $scope.input });
                        }, 0)

                    }


                }
            }
        };
    }]);

    doubanApp.directive('page', [function() {
        // Runs during compile
        return {
            replace: true,
            template: '<ul class="pagination">\
                <li ng-click="hundlePage(item)" ng-class="{active:item==current}" ng-repeat="item in pages"><a>{{item}}</a></li>\
            </ul>',
            link: function($scope, iElm, iAttrs, controller) {

                $scope.$watch('pageConfig', function(n) {
                    if (n) {
                        var total = n.total;
                        var show = n.show;
                        var current = n.current;

                        var region = Math.floor(show / 2); // 5

                        //左右俩边数字的个数
                        var begin = current - region;

                        //开始值最小是1
                        begin = Math.max(1, begin);

                        var end = begin + show;
                        //
                        if (end > total) { // 31 > 30
                            end = total + 1; // end = 31
                            begin = end - show //31 - 7 = 24     24,25,26,27,28,29,30
                            begin = Math.max(1, begin);
                        }
                        var pagination = iElm[0];

                        var pages = [];

                        $scope.pages = pages;
                        $scope.current = current;
                        $scope.hundlePage = function  (index) {
                            //调用控制器传递过来的方法
                            n.click(index);
                        }
                        for (var i = begin; i < end; i++) {
                            pages.push(i);
                        }
                    }
                })

            }
        };
    }]);



})();
