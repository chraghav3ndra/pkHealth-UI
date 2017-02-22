(function() {
    'use strict';

    angular
        .module('pkHealth')
        .controller('HomeController', HomeController);

    /** @ngInject */
    function HomeController($state) {
        var vm = this;

        vm.logout = logout;


        // Initial Actions
        _init();

        function logout() {
            $state.go("login");
        }

        function _init() {}
    }
})();
