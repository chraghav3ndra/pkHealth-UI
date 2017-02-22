(function() {
    'use strict';

    angular
        .module('pkHealth')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            // Initial landing screen
            .state('login', {
                url: '/login',
                templateUrl: 'app/login/login.html',
                controller: 'LoginController',
                controllerAs: 'login'
            })
            .state('home', {
                url: '/home',
                templateUrl: 'app/home/home.html',
                controller: 'HomeController',
                controllerAs: 'home'
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'app/dashboard/dashboard.html',
                controller: 'DashboardController',
                controllerAs: 'dashboard'
            })
            // Initial landing screen
            .state('registerDevices', {
                url: '/registerDevices',
                templateUrl: 'app/registerDevices/registerDevices.html',
                controller: 'RegisterDevicesController',
                controllerAs: 'register'
            });

        $urlRouterProvider.otherwise('/login');
    }

})();
