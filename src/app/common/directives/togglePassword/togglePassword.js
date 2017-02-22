angular
    .module("pkHealth")
    .directive("togglePassword", togglePassword);


function togglePassword() {

    var directive = {
        restrict: "E",
        templateUrl: "app/common/directives/togglePassword/template.html",
        controller: TogglePasswordController,
        controllerAs: "vm",
        bindToController: true,
        scope: {
            model: "=ngModel"
        }

    };

    return directive;


    /** @ngInject */
    function TogglePasswordController($log) {
        var vm = this;
        vm.toggle = false;

        _init();

        function _init() {
            $log.info("init");
        }
    }
}
