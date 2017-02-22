angular
    .module("pkHealth")
    .controller("DashboardController", DashboardController);

/** @ngInject */
function DashboardController($log, dashboardService) {

    var vm = this;
    vm.fitness = [];
    vm.sleep = [];

    vm.getSleepDetailsGraphOptions = getSleepDetailsGraphOptions;
    vm.getWalkingDetailsGraphOptions = getWalkingDetailsGraphOptions;

    var _walkingGraphOptions = null;
    var _sleepGraphOptions = null;

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
                            console.log("X Axis data", d);
                            return d3.time.format('%x')(new Date(d.timestamp))
                        },
                        rotateLabels: 30,
                        showMaxMin: false
                    },
                    yAxis: {
                        axisLabel: 'Sleep Time',
                        axisLabelDistance: -10,
                        tickFormat: function(d) {
                            console.log("Y Axis data", d);
                            return d3.format(',.1f')(d);
                        }
                    },
                    tooltip: {
                        keyFormatter: function(d) {
                            console.log("Tool data", d);
                            return d3.time.format('%x')(new Date(d.timestamp));
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
            }, function(error) {

            });

        dashboardService.getSleepData()
            .then(function(data) {
                var _sleepRecords = [];
                vm.sleep = [];
                _.each(data.sleep, function(rec) {
                    //vm.fitness = data.fitness;
                    rec.total_sleep = new Date(rec.total_sleep)
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
    }
}
