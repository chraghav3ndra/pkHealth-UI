angular
    .module("pkHealth")
    .factory("dashboardService", dashboardService);

/** @ngInject */
function dashboardService($q, $http, $log, callerService) {
    var services = {
        getSleepData: getSleepData,
        getFitnessData: getFitnessData
    };

    return services;

    function getSleepData() {
        var deferred = $q.defer();
        var url = "app/common/services/dashboard/dashboard_sleep.json";
        var config = {
            method: "GET",
            url: url
        };
        /*
                if (responseType) {
                    config.responseType = responseType;
                }
        */
        $http(config)
            .then(function(response) {
                $log.info("[caller-service].[get].[successful]", response.data);
                deferred.resolve(response.data);

            }, function(response) {
                $log.error("[caller-service].[get].[failure]", response);
                deferred.reject(response);
            });
        return deferred.promise;
    }

    function getFitnessData() {

        var deferred = $q.defer();
        var url = "app/common/services/dashboard/dashboard_data.json";
        var config = {
            method: "GET",
            url: url
        };
        /*
                if (responseType) {
                    config.responseType = responseType;
                }
        */
        $http(config)
            .then(function(response) {
                $log.info("[caller-service].[get].[successful]", response.data);
                deferred.resolve(response.data);

            }, function(response) {
                $log.error("[caller-service].[get].[failure]", response);
                deferred.reject(response);
            });
        return deferred.promise;

    }
}
