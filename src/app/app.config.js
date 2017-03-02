(function() {
    'use strict';

    angular
        .module('pkHealth')
        .config(config);

    /** @ngInject */
    function config($logProvider) {
        // Enable log
        $logProvider.debugEnabled(true);

    }

})();
