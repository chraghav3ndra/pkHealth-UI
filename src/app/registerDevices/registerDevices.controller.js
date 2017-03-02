(function() {
    "use strict";

    angular
        .module("pkHealth")
        .controller("RegisterDevicesController", RegisterDevicesController);
    /** @ngInject */
    function RegisterDevicesController($state, $log, registerDevicesService) {
        var vm = this;

        vm.registerDevicesService = registerDevicesService;
        _init();

        function registerDevices() {


        }

        function _init() {

        }

    }

    //LoginController.$inject = ["$state"];
})()
