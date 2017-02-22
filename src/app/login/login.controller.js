//(function () {
//  "use strict";

angular
    .module("pkHealth")
    .controller("LoginController", LoginController);
/** @ngInject */
function LoginController($state, $log) {
    var vm = this;
    vm.loginUserData = {};
    vm.login = login;
    vm.invalid = false;
    _init();

    function login() {
        $state.go("home");
    }

    function _init() {

    }

}

//LoginController.$inject = ["$state"];
//})()
