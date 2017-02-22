//(function() {
"use strict";
angular
    .module("pkHealth")
    .factory("registerDevicesService", registerDevicesService);

/** @ngInject */
function registerDevicesService() {
    var services = {
        getRegisterDevicesURL: getRegisterDevicesURL
    };

    return services;

    function getRegisterDevicesURL() {
        return "https://app.validic.com/5886781fff9d930008000050/dR4g_qjhNJ5SYtzmxZ1L";
    }
}
//})();
