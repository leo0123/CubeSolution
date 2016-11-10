var app = angular.module('myApp', ['ngMaterial']);
//app.service('expM', ExpressionManager);
//app.config(['$locationProvider', function ($locationProvider) {
//    $locationProvider.html5Mode(true);
//}]);
app.run(function ($rootScope, $location) {
    //var expM = new ExpressionManager();
    var expM = new CustomizeExpressionManager();
    var scope = $rootScope;
    scope.expManager = expM;
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
        var url = $location.$$absUrl;//id=1 or ad=leo.c.chen
        var regStr = /\bid\b\=\d*/i;
        //var regStr = /\bad\b\=[A-Za-z0-9\.]*/i;
        var paras = url.match(regStr);
        if (paras != null && paras.length > 0) {
            var idStr = paras[0];
            var subRegStr = /\d*$/;
            var ids = idStr.match(subRegStr);
            scope.id = ids[0];
            //scope.id = idStr.replace("ad=", "");
            //alert(scope.id);
        }
    })();
});
app.controller('myCtrl', myCtrl);
app.controller('PanelDialogCtrl', PanelDialogCtrl);

function myCtrl($scope, $mdPanel, $http, $location) {
    var scope = $scope.$root;
    var expM = scope.expManager;
    var serviceUrl = "http://amdpfweb02:8080/SAPBW3DataService.svc/";//"http://localhost:64951/SAPBW3DataService.svc/";
    var digestUrl = "http://amdpfwfe02:9999/_api/contextinfo";
    var listUrl = "http://amdpfwfe02:9999/_api/web/lists/getbytitle('Sales Person Profile')/items(" + $scope.$root.id + ")";
    //var listUrl = "http://amdpfwfedev01/sites/test/_api/web/lists/getbytitle('Sales Person Profile')/items?Title eq " + $scope.$root.id;

    //$element.find('input').on('keydown', function (ev) {
    //    ev.stopPropagation();
    //});
    $scope.onSearchChange = function (event) {
        event.stopPropagation();
    };
    $scope.inputProfitCenterChanged = function () {
        if ($scope.inputProfitCenter.length == 2) {
            var filter = "indexof(ProfitCenterCode, '" + $scope.inputProfitCenter + "') ge 0";
            if ($scope.selectedBG != null && $scope.selectedBG.length > 0) {
                filter += " and (BGCode eq ''";
                for (var i = 0; i < $scope.selectedBG.length; i++) {
                    filter += " or BGCode eq '" + $scope.selectedBG[0] + "'";
                }
                filter += ")";
            }
            searchProfitCenter(filter);
        }
        else if ($scope.inputProfitCenter.length < 2) {
            $scope.ProfitCenters = [];
            //$scope.searchProfitCenterResult = 'key word is too short';
        };
    };
    searchProfitCenter = function (filter) {
        var urlStr = serviceUrl + "DimProfitCenters?$filter=" + filter;
        //urlStr = serviceUrl + "DimProfitCenters?$filter=BGCode eq 'FMBG' or BGCode eq 'IABG'";
        $http({
            method: "GET",
            url: urlStr,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function mySucces(response) {
            $scope.ProfitCenters = response.data.d;
            //$scope.searchProfitCenterResult = 'click to select ProfitCenter';

        }, function myError(response) {
            $scope.status = response.status;
        })
    };
    testload = function () {
        var JSONStr = '{ "IsGroup": true, "Field": "root", "Value": null, "GroupLogic": " and ", "Children": [ { "IsGroup": true, "Field": "BGCode", "Value": null, "GroupLogic": " or ", "Children": [ { "IsGroup": false, "Field": "BGCode", "Value": "MSBU", "GroupLogic": "", "Children": null }, { "IsGroup": false, "Field": "BGCode", "Value": "CLBG", "GroupLogic": "", "Children": null } ] }, { "IsGroup": true, "Field": "ProfitCenterCode", "Value": null, "GroupLogic": " or ", "Children": [ { "IsGroup": false, "Field": "ProfitCenterCode", "Value": "CNCR1", "GroupLogic": "", "Children": null }, { "IsGroup": false, "Field": "ProfitCenterCode", "Value": "APT04CD", "GroupLogic": "", "Children": null } ] }, { "IsGroup": true, "Field": "SalesP", "Value": null, "GroupLogic": " or ", "Children": [ { "IsGroup": false, "Field": "SalesP", "Value": "JLITT", "GroupLogic": "", "Children": null }, { "IsGroup": false, "Field": "SalesP", "Value": "KHSU", "GroupLogic": "", "Children": null } ] }, { "IsGroup": true, "Field": "Office", "Value": null, "GroupLogic": " or ", "Children": [ { "IsGroup": false, "Field": "Office", "Value": "DGA", "GroupLogic": "", "Children": null }, { "IsGroup": false, "Field": "Office", "Value": "VVK", "GroupLogic": "", "Children": null } ] }, { "IsGroup": true, "Field": "SalesOffice", "Value": null, "GroupLogic": " or ", "Children": [ { "IsGroup": false, "Field": "SalesOffice", "Value": "DGA", "GroupLogic": "", "Children": null }, { "IsGroup": false, "Field": "SalesOffice", "Value": "DGB", "GroupLogic": "", "Children": null } ] }, { "IsGroup": true, "Field": "SalesTypeName", "Value": null, "GroupLogic": " or ", "Children": [ { "IsGroup": false, "Field": "SalesTypeName", "Value": "Design In", "GroupLogic": "", "Children": null }, { "IsGroup": false, "Field": "SalesTypeName", "Value": "Trading", "GroupLogic": "", "Children": null } ] }, { "IsGroup": true, "Field": "EndCustomerName", "Value": null, "GroupLogic": " or ", "Children": [ { "IsGroup": false, "Field": "EndCustomerName", "Value": "APPLE", "GroupLogic": "", "Children": null }, { "IsGroup": false, "Field": "EndCustomerName", "Value": "AMAZON", "GroupLogic": "", "Children": null } ] }, { "IsGroup": true, "Field": "SoldToCustomerName", "Value": null, "GroupLogic": " or ", "Children": [ { "IsGroup": false, "Field": "SoldToCustomerName", "Value": "DELL", "GroupLogic": "", "Children": null }, { "IsGroup": false, "Field": "SoldToCustomerName", "Value": "COSTCO EAST PLANO", "GroupLogic": "", "Children": null } ] } ] }';
        var jsonObject = angular.fromJson(JSONStr);
        $scope.$root.setRoot(jsonObject);
        $scope.selectedBG = [];
        $scope.selectedProfitCenter = [];
        $scope.selectedSalesP = [];
        $scope.selectedEndCustomer = [];
        $scope.selectedSoldToCustomer = [];
        $scope.selectedOffice = [];
        $scope.selectedSalesOffice = [];
        $scope.selectedSalesType = [];
        var lists = {
            selectedBG: $scope.selectedBG
            , selectedProfitCenter: $scope.selectedProfitCenter
            , selectedSalesP: $scope.selectedSalesP
            , selectedEndCustomer: $scope.selectedEndCustomer
            , selectedSoldToCustomer: $scope.selectedSoldToCustomer
            , selectedOffice: $scope.selectedOffice
            , selectedSalesOffice: $scope.selectedSalesOffice
            , selectedSalesType: $scope.selectedSalesType
        };
        expM.tryParse(lists);
        if (lists.selectedProfitCenter.length > 0) {
            var filter = "ProfitCenterCode eq ''";
            for (var i = 0; i < lists.selectedProfitCenter.length; i++) {
                filter += " or ProfitCenterCode eq '" + lists.selectedProfitCenter[i] + "'";
            }
            searchProfitCenter(filter);
        }
        if (lists.selectedEndCustomer.length > 0) {
            var filter = "CustomerEntityName eq '1'";
            for (var i = 0; i < lists.selectedEndCustomer.length; i++) {
                filter += " or CustomerEntityName eq '" + lists.selectedEndCustomer[i] + "'";
            }
            searchEndCustomer(filter);
        }
        if (lists.selectedSoldToCustomer.length > 0) {
            var filter = "CustomerName eq ''";
            for (var i = 0; i < lists.selectedSoldToCustomer.length; i++) {
                filter += " or CustomerName eq '" + lists.selectedSoldToCustomer[i] + "'";
            }
            searchSoldToCustomer(filter);
        }
    };

    $scope.inputEndCustomerChanged = function () {
        if ($scope.inputEndCustomer.length == 2) {
            var filter = "indexof(CustomerEntityName, '" + $scope.inputEndCustomer + "') ge 0";
            searchEndCustomer(filter);
        }
        else if ($scope.inputEndCustomer.length < 2) {
            $scope.EndCustomers = [];
            //$scope.searchEndCustomerResult = 'key word is too short';
        };
    };
    searchEndCustomer = function (filter) {
        var urlStr = serviceUrl + "DimCustomerEntities?$filter=" + filter;
        $http({
            method: "GET",
            url: urlStr,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function mySucces(response) {
            $scope.EndCustomers = response.data.d;
            //$scope.searchEndCustomerResult = 'click to select Customer';

        }, function myError(response) {
            $scope.status = response.status;
        })
    };
    $scope.inputSoldToCustomerChanged = function () {
        if ($scope.inputSoldToCustomer.length == 3) {
            var filter = "indexof(CustomerName, '" + $scope.inputSoldToCustomer + "') ge 0";
            searchSoldToCustomer(filter);
        }
        else if ($scope.inputSoldToCustomer.length < 3) {
            $scope.SoldToCustomers = [];
            //$scope.searchSoldToCustomerResult = 'key word is too short';
        };
    };
    searchSoldToCustomer = function myfunction(filter) {
        var urlStr = serviceUrl + "vDimCustomers?$filter=" + filter;
        $http({
            method: "GET",
            url: urlStr,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function mySucces(response) {
            $scope.SoldToCustomers = response.data.d;
            //$scope.searchSoldToCustomerResult = 'click to select Customer';

        }, function myError(response) {
            $scope.status = response.status;
        })
    };
    $scope.selectedChanged = function (field) {
        var list = null;
        if (field == 'BGCode') {
            list = $scope.selectedBG;
        }
        else if (field == 'ProfitCenterCode') {
            list = $scope.selectedProfitCenter;
        }
        else if (field == 'SalesP') {
            list = $scope.selectedSalesP;
        }
        else if (field == 'EndCustomerName') {
            list = $scope.selectedEndCustomer;
        }
        else if (field == 'SoldToCustomerName') {
            list = $scope.selectedSoldToCustomer;
        }
        else if (field == 'Office') {
            list = $scope.selectedOffice;
        }
        else if (field == 'SalesOffice') {
            list = $scope.selectedSalesOffice;
        }
        else if (field == 'SalesTypeName') {
            list = $scope.selectedSalesType;
        }
        expM.clearGroup(field);
        for (var i = 0; i < list.length; i++) {
            var value = list[i];
            expM.addInGroup(field, value);
        }
    };
    $scope.previousTab = function () {
        if ($scope.selectedTabIndex > 0) {
            $scope.selectedTabIndex = $scope.selectedTabIndex - 1;
        }
    };
    $scope.nextTab = function () {
        if ($scope.selectedTabIndex < 7) {
            $scope.selectedTabIndex = $scope.selectedTabIndex + 1;
        }
    };
    $scope.loadOption = function () {
        $scope.waiting = true;
        var urlStr = serviceUrl + "DimBGs?$orderby=BGCode";
        $http({
            method: "GET",
            url: urlStr,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function mySucces(response) {
            $scope.BGs = response.data.d;
        }, function myError(response) {
            $scope.status = response.status;
        });
        urlStr = serviceUrl + "DimSalesPs";
        $http({
            method: "GET",
            url: urlStr,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function mySucces(response) {
            $scope.SalesPs = response.data.d;
            $scope.waiting = false;
        }, function myError(response) {
            $scope.status = response.status;
        });
        urlStr = serviceUrl + "vDimOffices";
        $http({
            method: "GET",
            url: urlStr,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function mySucces(response) {
            $scope.Offices = response.data.d;
        }, function myError(response) {
            $scope.status = response.status;
        });
        urlStr = serviceUrl + "vDimSalesOffices";
        $http({
            method: "GET",
            url: urlStr,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function mySucces(response) {
            $scope.SalesOffices = response.data.d;
        }, function myError(response) {
            $scope.status = response.status;
        });
        urlStr = serviceUrl + "DimSalesTypes";
        $http({
            method: "GET",
            url: urlStr,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function mySucces(response) {
            $scope.SalesTypes = response.data.d;
        }, function myError(response) {
            $scope.status = response.status;
        });
    };
    $scope.loadOption();

    $scope.getFormDigestService = function ($http, actSave) {
        $http({
            method: "POST",
            url: digestUrl,
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
        var urlStr = listUrl;
        //var metadata = "{ '__metadata': { 'type': 'SP.Data.CubePermissionsListItem' }, 'Title': 'am.user3'}";
        var json = angular.toJson($scope.$root.root);
        var sql = $scope.$root.root.ToString();
        var metadata = { __metadata: { type: 'SP.Data.Sales_x0020_Person_x0020_ProfileListItem' }, JSONStr: json, Permission: sql };
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
            //$scope.DomainAccount = response.data.d.Title;
            //var jsonObject = angular.fromJson(response.data.d.JSONStr);
            //$scope.$root.setRoot(jsonObject);
            $scope.status = "saved"
        }, function myError(response) {
            $scope.status = response.status;
        });
    };

    $scope.save = function () {
        if ($scope.WorkflowStatus == "lock") {
            $scope.status = "can not save, in approving";
        } else {
            $scope.status = "saving";
            $scope.getFormDigestService($http, $scope.actSave);
        }
    };

    $scope.load = function () {
        //test
        //testload();
        //return;
        //test
        var urlStr = listUrl;
        $http({
            method: "GET",
            //url: "http://localhost:8137/api/userslines/1",
            url: urlStr,
            headers: {
                'Accept': 'application/json;odata=verbose'
            }
        }).then(function mySucces(response) {
            $scope.DomainAccount = response.data.d.Title;
            $scope.WorkflowStatus = response.data.d.WorkflowStatus;
            if (response.data.d.JSONStr != null) {
                var jsonObject = angular.fromJson(response.data.d.JSONStr);
                $scope.$root.setRoot(jsonObject);
                //$scope.DomainAccount = response.data.d.JSONStr;
            }
        }, function myError(response) {
            $scope.status = response.status;
        });
    };
    $scope.load();

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