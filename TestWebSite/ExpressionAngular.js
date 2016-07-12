var app = angular.module('myApp', ['ngMaterial']);
//app.service('expM', ExpressionManager);
//app.config(['$locationProvider', function ($locationProvider) {
//    $locationProvider.html5Mode(true);
//}]);
app.run(function ($rootScope, $location) {
    var expM = new ExpressionManager();
    var scope = $rootScope;
    //scope.expManager = expM;
    scope.dialogStatus = 'status';
    scope.root = expM.getRoot();
    scope.field = 'f';
    scope.value = 'v';
    scope.currentExp = null;
    scope.currentGroup = null;
    scope.mdPanelRef = null;
    scope.setRoot = function (jsonObject) {
        expM.setRoot(jsonObject);
        scope.root = expM.getRoot();
    };
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
    (function () {
        var url = $location.$$absUrl;
        var regStr = /\bid\b\=\d*/i;
        var paras = url.match(regStr);
        var idStr = paras[0];
        var subRegStr = /\d*$/;
        var ids = idStr.match(subRegStr);
        scope.id = ids[0];
    })();
});
app.controller('myCtrl', myCtrl);
app.controller('PanelDialogCtrl', PanelDialogCtrl);

function myCtrl($scope, $mdPanel, $http, $location) {
    //$scope.test = function () {
    //    var url = $location.$$absUrl;
    //    var regStr = /\bid\b\=\d*/;
    //    var paras = url.match(regStr);
    //    var idStr = paras[0];
    //    var subRegStr = /\d*$/;
    //    var ids = idStr.match(subRegStr);
    //    $scope.testhttp = ids[0];
    //}

    $scope.getFormDigestService = function ($http, actSave) {
        $http({
            method: "POST",
            url: "http://amdpfwfedev01/sites/MyDelta/_api/contextinfo",
            data: '',
            headers: {
                'Accept': 'application/json;odata=verbose'
            },
        }).success(function (data) {
            var digest = data.d.GetContextWebInformation.FormDigestValue;
            actSave(digest);
        }).error(function (err) {
            var t = err.status;
        });
    };

    $scope.actSave = function (digest) {
        var urlStr = "http://amdpfwfedev01/sites/MyDelta/_api/web/lists/getbytitle('CubePermissions')/items(" + $scope.$root.id + ")";
        //var metadata = "{ '__metadata': { 'type': 'SP.Data.CubepermissionsListItem' }, 'Title': 'am.user3'}";
        var json = angular.toJson($scope.$root.root);
        var sql = $scope.$root.root.ToString();
        var metadata = { __metadata: { type: 'SP.Data.CubePermissionsListItem' }, JSONStr: json, SQLStr: sql };
        $http({
            method: "POST",
            url: urlStr,
            data: metadata,
            headers: {
                "X-HTTP-Method": "MERGE",
                "accept": "application/json;odata=verbose",
                "content-type": "application/json;odata=verbose",
                "content-length": metadata.length,
                "X-RequestDigest": digest,
                "IF-MATCH": "*"
            }
        }).then(function mySucces(response) {
            $scope.testhttp = response.data.d.Title;
            var jsonObject = angular.fromJson(response.data.d.JSONStr);
            $scope.$root.setRoot(jsonObject);
        }, function myError(response) {
            $scope.testhttp = response.status;
        });
    };

    $scope.save = function () {
        $scope.getFormDigestService($http, $scope.actSave);
    };

    $scope.load = function () {
        var urlStr = "http://amdpfwfedev01/sites/MyDelta/_api/web/lists/getbytitle('CubePermissions')/items(" + $scope.$root.id + ")";
        $http({
            method: "GET",
            //url: "http://localhost:8137/api/userslines/1",
            url: urlStr,
            headers: {
                'Accept': 'application/json;odata=verbose'
            }
        }).then(function mySucces(response) {
            $scope.testhttp = response.data.d.Title;
            var jsonObject = angular.fromJson(response.data.d.JSONStr);
            $scope.$root.setRoot(jsonObject);
            //$scope.testhttp = response.data.d.JSONStr;
        }, function myError(response) {
            $scope.testhttp = response.status;
        });
    };

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