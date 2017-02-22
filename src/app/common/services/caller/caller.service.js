//(fuction() {
angular
    .module("pkHealth")
    .factory("callerService", callerService);

/** ngInject */
function callerService($http, $log, $q, $sce, $location) {
    var services = {
        get: get,
        post: post
    };

    return services;

    /**
     * Get method caller
     */
    function get(endpoint, params, responseType) {
        var deferred = $q.defer();
        var url = _constructServiceURL(endpoint, params);
        var config = {
            method: "GET",
            url: url
        };

        if (responseType) {
            config.responseType = responseType;
        }

        $http(config)
            .then(function(response) {
                if (response.status === 403) {
                    $log.error("[caller-service].[get].[failure]", response);
                    deferred.reject(response);
                } else {
                    $log.info("[caller-service].[get].[successful]", response.data);
                    deferred.resolve(response.data);
                }

            }, function(response) {
                $log.error("[caller-service].[get].[failure]", response);
                deferred.reject(response);
            });
        return deferred.promise;
    }

    /**
     * Post method service caller
     */
    function post(endpoint, postData, responseType) {
        var deferred = $q.defer();
        var url = _constructServiceURL(endpoint);
        var config = {
            method: "POST",
            url: url
        };
        if (responseType) {
            config.responseType = responseType;
        }
        if (postData) {
            config.data = postData;
        }

        $http(config)
            .then(function successCallback(response) {

                if (response.status === 403) {
                    $log.error("[caller-service].[get].[failure]", response);
                    deferred.reject(response);
                } else {
                    $log.info("caller-service->post->successful", response.data);
                    var contentDisposition = response.headers("content-disposition");
                    var fileName = "";
                    var fileResponse = {
                        "data": {},
                        "fileName": ""
                    };
                    if (contentDisposition) {
                        fileName = contentDisposition.substr(contentDisposition.indexOf("filename=") + 9);
                        fileName = fileName.replace(/\"/g, "");
                        fileResponse.fileName = fileName;
                        fileResponse.data = response.data;
                        deferred.resolve(fileResponse);
                    } else {
                        deferred.resolve(response.data);
                    }
                }


            }, function failiureCallback(response) {
                $log.info("caller-service->post->failed", response);
                deferred.reject(response);
            });
        return deferred.promise;

    }

    function _constructServiceURL(endpoint, params) {
        var url = "";
        var domain = "http://localhost:3000";
        var host = $location.$$host;
        var protocol = $location.$$protocol;
        switch (host) {
            case "localhost":
                domain = "http://localhost:" + $location.$$port;
                break;
            default:
                domain = protocol + "://" + host;
                break;
        }
        $log.info("$location", $location.$host);
        var query = "?";
        var paramLength;
        var index = 0;
        if (params) {
            paramLength = params.length;
            _.each(params, function(paramaKey, paramValue) {
                query = query + paramKey + "=" + paramKey
                index++;
                if (index < paramLength) {
                    query = query + "&";
                }
            });
            url = domain + "/" + endpoint + query;
        } else {
            url = domain + "/" + endpoint;
        }

        return url;
    }
}

//})()
