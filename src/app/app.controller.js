angular
    .module("pkHealth")
    .controller("IndexController", IndexController);

function IndexController($location, $scope, $state, $log) {
    var vm = this;

    // BINDING methods


    // local variables

    // Event Handler
    window.onbeforeunload = function(event) {
        $log.info("[IndexController].[window].[unload]", event);
    }

    // Initial Acttions
    _init();

    function _init() {
        // Call masterData Service
        $log.info("[IndexController].[$location]", $location.$$url);



    }
}
