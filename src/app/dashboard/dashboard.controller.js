angular
    .module("pkHealth")
    .controller("DashboardController", DashboardController);

/** @ngInject */
function DashboardController($log, $scope, $timeout, dashboardService) {

    var vm = this;
    vm.fitness = [];
    vm.sleep = [];

    vm.getSleepDetailsGraphOptions = getSleepDetailsGraphOptions;
    vm.getWalkingDetailsGraphOptions = getWalkingDetailsGraphOptions;

    var _walkingGraphOptions = null;
    var _sleepGraphOptions = null;

    vm.gridsterOptions = {
        margins: [20, 20],
        columns: 4,
        mobileModeEnabled: false,
        draggable: {
            handle: 'h3'
        },
        resizable: {
            enabled: true,
            handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],

            // optional callback fired when resize is started
            start: function(event, $element, widget) {},

            // optional callback fired when item is resized,
            resize: function(event, $element, widget) {
                if (widget.chart.api) widget.chart.api.update();
            },

            // optional callback fired when item is finished resizing
            stop: function(event, $element, widget) {
                $timeout(function() {
                    if (widget.chart.api) widget.chart.api.update();
                }, 400)
            }
        },
    };

    function _getData() {
        var _dashboard = {
            widgets: [{
                col: 0,
                row: 0,
                sizeY: 2,
                sizeX: 2,
                name: "Sleep pattern Chart",
                chart: {
                    options: getSleepDetailsGraphOptions(),
                    data: vm.sleep,
                    api: {}
                }
            }, {
                col: 1,
                row: 0,
                sizeY: 2,
                sizeX: 2,
                name: "Workout Chart",
                chart: {
                    options: getWalkingDetailsGraphOptions(),
                    data: vm.fitness,
                    api: {}
                }
            }]
        };

        return _dashboard;

    }

    function getWalkingDetailsGraphOptions() {
        if (_.isNull(_walkingGraphOptions)) {
            _walkingGraphOptions = {
                chart: {
                    type: 'pieChart',
                    height: 450,
                    donut: true,
                    x: function(d) {
                        return d.duration;
                    },
                    y: function(d) {
                        return d.distance;
                    },
                    showLabels: true,

                    pie: {
                        startAngle: function(d) {
                            return d.startAngle / 2 - Math.PI / 2
                        },
                        endAngle: function(d) {
                            return d.endAngle / 2 - Math.PI / 2
                        }
                    },
                    duration: 500,
                    legend: {
                        margin: {
                            top: 5,
                            right: 70,
                            bottom: 5,
                            left: 0
                        }
                    }
                }
            };
        }
        return _walkingGraphOptions;
    }

    // We want to manually handle `window.resize` event in each directive.
    // So that we emulate `resize` event using $broadcast method and internally subscribe to this event in each directive
    // Define event handler
    $scope.events = {
        resize: function(e, scope) {
            $timeout(function() {
                scope.api.update()
            }, 200)
        }
    };
    angular.element(window)
        .on('resize', function(e) {
            $scope.$broadcast('resize');
        });

    // We want to hide the charts until the grid will be created and all widths and heights will be defined.
    // So that use `visible` property in config attribute
    $scope.config = {
        visible: false
    };
    $timeout(function() {
        $scope.config.visible = true;
    }, 200);


    function getSleepDetailsGraphOptions() {
        if (_.isNull(_sleepGraphOptions)) {
            _sleepGraphOptions = {
                chart: {
                    type: 'historicalBarChart',
                    height: 450,
                    donut: true,
                    x: function(d) {
                        console.log("x data", d);
                        return d.timestamp;
                    },
                    y: function(d) {
                        console.log("y data", d);
                        return d.total_sleep;
                    },
                    showLabels: true,
                    duration: 500,
                    zoom: {
                        enabled: true,
                        scaleExtent: [1, 10],
                        useFixedDomain: false,
                        useNiceScale: false,
                        horizontalOff: false,
                        verticalOff: true,
                        unzoomEventType: 'dblclick.zoom'
                    },
                    xAxis: {
                        axisLabel: 'Dates',
                        tickFormat: function(d) {
                            console.log("X Axis data", d3.time.format('%x')(new Date(d)));
                            return d3.time.format('%x')(new Date(d));
                        },
                        rotateLabels: 30,
                        showMaxMin: false
                    },
                    yAxis: {
                        axisLabel: 'Sleep Time',
                        axisLabelDistance: -10,
                        tickFormat: function(d) {
                            console.log("Y Axis data", d);
                            return d3.format(',.1f')(d / 1000);
                        }
                    },
                    tooltip: {
                        keyFormatter: function(d) {
                            console.log("Tool data", d);
                            return d.timestamp; //d3.time.format('%x')(new Date(d.timestamp));
                        }
                    },
                }
            };

        }
        return _sleepGraphOptions;
    }

    // On Page load
    _onload();


    function _onload() {
        dashboardService.getFitnessData()
            .then(function(data) {
                vm.fitness = [];
                _.each(data.fitness, function(rec) {
                    if (rec.type === 'walking') {
                        vm.fitness.push(rec);
                    }
                });
                //vm.fitness = data.fitness;
                $log.info("vm.fitness", vm.fitness);
                dashboardService.getSleepData()
                    .then(function(data) {
                        var _sleepRecords = [];
                        vm.sleep = [];
                        _.each(data.sleep, function(rec) {
                            //vm.fitness = data.fitness;
                            rec.timestamp = new Date(rec.timestamp)
                                .getTime();
                            _sleepRecords.push(rec);
                        });


                        //vm.fitness = data.fitness;
                        $log.info("vm.sleep", _sleepRecords);
                        vm.sleep = [{
                            "values": _sleepRecords
                        }];
                    }, function(error) {

                    });
                dashboardService.getSleepData()
                    .then(function(data) {
                        var _sleepRecords = [];
                        vm.sleep = [];
                        _.each(data.sleep, function(rec) {
                            //vm.fitness = data.fitness;
                            rec.timestamp = new Date(rec.timestamp)
                                .getTime();
                            _sleepRecords.push(rec);
                        });


                        //vm.fitness = data.fitness;
                        $log.info("vm.sleep", _sleepRecords);
                        vm.sleep = [{
                            "values": _sleepRecords
                        }];
                        vm.dashboard = _getData();
                    }, function(error) {

                    });
            }, function(error) {

            });



    }
}
