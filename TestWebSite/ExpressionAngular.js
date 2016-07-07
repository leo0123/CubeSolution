var app = angular.module('myApp', ['ngMaterial']);
//app.service('expM', ExpressionManager);
app.run(function ($rootScope) {
    var expM = new ExpressionManager();
    var scope = $rootScope;
    scope.dialogStatus = 'status';
    scope.root = expM.getRoot();
    scope.field = 'f';
    scope.value = 'v';
    scope.currentExp = null;
    scope.currentGroup = null;
    scope.mdPanelRef = null;
    scope.save = function () {
        if (scope.dialogStatus == "addInGroup") {
            expM.add(scope.currentGroup, scope.field, scope.value);
        }
        else if (scope.dialogStatus == "edit") {
            scope.currentExp.setFieldValue(scope.field, scope.value);
        }
        else if (scope.dialogStatus == "addGroup") {
            expM.addGroup(scope.currentGroup, scope.field, scope.value);
            scope.root = expM.getRoot();
        }
        scope.mdPanelRef.close();
    };
});
app.controller('myCtrl', myCtrl);
app.controller('PanelDialogCtrl', PanelDialogCtrl);

function myCtrl($scope, $mdPanel) {
    $scope.openMenu = function ($mdOpenMenu, $event) {
        //originatorEv = ev;
        $mdOpenMenu($event);
    };
    $scope.showDialog = function ($mdPanel) {
        var position = $mdPanel.newPanelPosition()
            .absolute()
            .center();
        var config = {
            attachTo: angular.element(document.body),
            controller: PanelDialogCtrl,
            //controllerAs: 'myCtrl',
            //disableParentScroll: this.disableParentScroll,
            templateUrl: 'panel.tmpl.html',
            hasBackdrop: true,
            panelClass: 'demo-dialog-example',
            position: position,
            trapFocus: true,
            zIndex: 150,
            clickOutsideToClose: true,
            escapeToClose: true,
            focusOnOpen: true
        };
        $mdPanel.open(config);
    };

    $scope.edit = function (exp) {
        var scope = $scope.$root;
        scope.currentExp = exp;
        scope.field = exp.Field;
        scope.value = exp.Value;
        scope.dialogStatus = "edit";
        $scope.showDialog($mdPanel);
    };
    $scope.addInGroup = function (group) {
        var scope = $scope.$root;
        scope.currentGroup = group;
        scope.dialogStatus = "addInGroup";
        $scope.showDialog($mdPanel);
    };
    $scope.addGroup = function (group) {
        var scope = $scope.$root;
        scope.currentGroup = group;
        scope.dialogStatus = "addGroup";
        $scope.showDialog($mdPanel);
    };
    $scope.changeGroupLogic = function (exp) {
        exp.changeGroupLogic();
    };
};

function PanelDialogCtrl(mdPanelRef, $scope) {
    $scope.$root.mdPanelRef = mdPanelRef;
};