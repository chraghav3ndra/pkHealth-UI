angular.module('pkHealth')
    .controller("ModalController", ModalController);

/** @ngInject */
function ModalController($scope, $uibModalInstance, $log, modalService) {
    var vm = this;
    vm.title = "";
    vm.message = "";
    vm.showCancel = false;
    vm.ok = ok;
    vm.cancel = cancel;
    _init();

    function _init() {
        if (!_.isUndefined(modalService.getTitle()) || !_.isEmpty(modalService.getTitle())) {
            vm.title = modalService.getTitle();
        }
        if (!_.isUndefined(modalService.getMessage()) || !_.isEmpty(modalService.getMessage())) {
            vm.message = modalService.getMessage();
        }

        if (!_.isUndefined(modalService.hasCancel()) || !_.isEmpty(modalService.hasCancel())) {
            vm.showCancel = modalService.hasCancel();
        }
    }

    function ok(event) {
        var okHandler = modalService.getOkHandler();
        try {
            if (!_.isUndefined(okHandler)) {
                okHandler();
            }
        } finally {
            event.preventDefault();
            $uibModalInstance.close("Accept");
        }

    }

    function cancel(event) {
        $log.info("back to page", event);
        event.preventDefault();
        $uibModalInstance.dismiss('Cancel');
    }
}
