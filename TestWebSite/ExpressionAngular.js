var app = angular.module('myApp', ['ngMaterial']);

var expM = new CustomizeExpressionManager();
var currentExp;
var currentGroup;
var dialogStatus;

app.run(function ($rootScope, $location) {
    var rootScope = $rootScope;

    dialogStatus = 'status';
    rootScope.expRoot = expM.getRoot();
    rootScope.field = 'f';
    rootScope.value = 'v';
    rootScope.mdPanelRef = null;
    $("#btSetFieldValueOK").click(function () {
        if (dialogStatus == "addInGroup") {
            expM.add(currentGroup, rootScope.field, rootScope.value);
        }
        else if (dialogStatus == "edit") {
            currentExp.setFieldValue(rootScope.field, rootScope.value);
        }
        else if (dialogStatus == "addGroup") {
            expM.addGroup(currentGroup, rootScope.field, rootScope.value);
            rootScope.expRoot = expM.getRoot();
        }
        //rootScope.mdPanelRef.close();
        $("#setFieldValueContainer").hide();
        rootScope.$apply();
    });
    $("#btSetFieldValueCancel").click(function () {
        $("#setFieldValueContainer").hide();
    });
});
app.controller('myCtrl', myCtrl);
app.controller('PanelDialogCtrl', PanelDialogCtrl);

var serviceUrl = "http://amdpfweb02:8080/SAPBW3DataService.svc/";
var digestUrl = "http://amdpfwfe02:9999/_api/contextinfo";

function myCtrl($scope, $mdPanel, $http, $location) {
    var rootScope = $scope.$root;

    $("#setFieldValueContainer").hide();
    $("#permissionEditor").hide();
    $("#btPermissionEditor").click(function () {
        $("#permissionEditor").show();
        //var spPermission=$("#tb1");
        var spJSONStr = $("[title='JSONStr']");
        if (spJSONStr.val() != "") {
            setRoot(angular.fromJson(spJSONStr.val()));
        }
        rootScope.$apply();
    });
    $("#btPermissionOK").click(function () {
        var spPermission = $("[title='Permission']");
        var spJSONStr = $("[title='JSONStr']");
        spJSONStr.val(angular.toJson(expM.getRoot()));
        spPermission.val(expM.getRoot().ToString());
        $("#permissionEditor").hide();
    });
    $("#btPermissionCancel").click(function () {
        $("#permissionEditor").hide();
    });
    loadOption();

    setRoot = function (jsonObject) {
        expM.setRoot(jsonObject);
        rootScope.expRoot = expM.getRoot();
        rootScope.$apply();
    };
    var listUrl = "http://amdpfwfe02:9999/_api/web/lists/getbytitle('Sales Person Profile')/items(" + $scope.$root.id + ")";
    $scope.onSearchChange = function (event) {
        event.stopPropagation();
    };
    $scope.inputProfitCenterChanged = function () {
        if ($scope.inputProfitCenter.length == 2) {
            var filter = "indexof(Value, '" + $scope.inputProfitCenter + "') ge 0";
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
        };
    };
    searchProfitCenter = function (filter) {
        var urlStr = serviceUrl + "vDimProfitCenter4SalesProfile?$filter=" + filter;
        $http({
            method: "GET",
            url: urlStr,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function mySucces(response) {
            $scope.ProfitCenters = response.data.d;
        }, function myError(response) {
            $scope.status = response.status;
        })
    };

    $scope.inputCommonChanged = function () {
        searchCommon();
    };
    searchCommon = function () {
        var view;
        var l = 0;
        if ($scope.$root.field == "BG") {
            view = "vDimBG4SalesProfile";
            l = 0;
        } else if ($scope.$root.field == "ProfitCenter") {
            view = "vDimProfitCenter4SalesProfile";
            l = 2;
        } else if ($scope.$root.field == "SalesP") {
            view = "vDimSalesP4SalesProfile";
            l = 0;
        } else if ($scope.$root.field == "Office") {
            view = "vDimOffice4SalesProfile";
            l = 0;
        } else if ($scope.$root.field == "[Sales Office]") {
            view = "vDimSalesOffice4SalesProfile";
            l = 0;
        } else if ($scope.$root.field == "[Sales Type]") {
            view = "vDimSalesType4SalesProfile";
            l = 0;
        } else if ($scope.$root.field == "[End Customer]") {
            view = "vDimCustomerEntity4SalesProfile";
            l = 2;
        } else if ($scope.$root.field == "CustName") {
            view = "vDimCustomer4SalesProfile";
            l = 2;
        }
        if ($scope.inputCommon.length < l) {
            $scope.commonList = [];
            return;
        }
        if ($scope.inputCommon.length > l) {
            return;
        }
        var filter = "";
        if ($scope.inputCommon != "") {
            filter = "?$filter=indexof(Value, '" + $scope.inputCommon + "') ge 0";
        }
        var urlStr = serviceUrl + view + filter;
        $http({
            method: "GET",
            url: urlStr,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function mySucces(response) {
            $scope.commonList = response.data.d;
        }, function myError(response) {
            $scope.status = response.status;
        })
    };

    $scope.inputEndCustomerChanged = function () {
        if ($scope.inputEndCustomer.length == 2) {
            var filter = "indexof(Value, '" + $scope.inputEndCustomer + "') ge 0";
            searchEndCustomer(filter);
        }
        else if ($scope.inputEndCustomer.length < 2) {
            $scope.EndCustomers = [];
        };
    };
    searchEndCustomer = function (filter) {
        var urlStr = serviceUrl + "vDimCustomerEntity4SalesProfile?$filter=" + filter;
        $http({
            method: "GET",
            url: urlStr,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function mySucces(response) {
            $scope.EndCustomers = response.data.d;
        }, function myError(response) {
            $scope.status = response.status;
        })
    };
    $scope.inputSoldToCustomerChanged = function () {
        if ($scope.inputSoldToCustomer.length == 3) {
            var filter = "indexof(Value, '" + $scope.inputSoldToCustomer + "') ge 0";
            searchSoldToCustomer(filter);
        }
        else if ($scope.inputSoldToCustomer.length < 3) {
            $scope.SoldToCustomers = [];
        };
    };
    searchSoldToCustomer = function myfunction(filter) {
        var urlStr = serviceUrl + "vDimCustomer4SalesProfile?$filter=" + filter;
        $http({
            method: "GET",
            url: urlStr,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function mySucces(response) {
            $scope.SoldToCustomers = response.data.d;
        }, function myError(response) {
            $scope.status = response.status;
        })
    };
    $scope.selectedChanged = function (field) {
        var list = null;
        if (field == 'BG') {
            list = $scope.selectedBG;
        }
        else if (field == 'ProfitCenter') {
            list = $scope.selectedProfitCenter;
        }
        else if (field == 'SalesP') {
            list = $scope.selectedSalesP;
        }
        else if (field == '[End Customer]') {
            list = $scope.selectedEndCustomer;
        }
        else if (field == 'CustName') {
            list = $scope.selectedSoldToCustomer;
        }
        else if (field == 'Office') {
            list = $scope.selectedOffice;
        }
        else if (field == '[Sales Office]') {
            list = $scope.selectedSalesOffice;
        }
        else if (field == '[Sales Type]') {
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
    var nLoad = 0
    function isLoaded() {
        if (nLoad == 5) {
            //rootScope.$apply();    
        }
    };
    function loadOption() {
        $scope.waiting = true;
        var urlStr = serviceUrl + "vDimBG4SalesProfile?$orderby=Value";
        $http({
            method: "GET",
            url: urlStr,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function mySucces(response) {
            $scope.BGs = response.data.d;
            nLoad++;
            isLoaded();
        }, function myError(response) {
            $scope.status = response.status;
            nLoad++;
            isLoaded();
        });
        urlStr = serviceUrl + "vDimSalesP4SalesProfile";
        $http({
            method: "GET",
            url: urlStr,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function mySucces(response) {
            $scope.SalesPs = response.data.d;
            $scope.waiting = false;
            nLoad++;
            isLoaded();
        }, function myError(response) {
            $scope.status = response.status;
            nLoad++;
            isLoaded();
        });
        urlStr = serviceUrl + "vDimOffice4SalesProfile";
        $http({
            method: "GET",
            url: urlStr,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function mySucces(response) {
            $scope.Offices = response.data.d;
            nLoad++;
            isLoaded();
        }, function myError(response) {
            $scope.status = response.status;
            nLoad++;
            isLoaded();
        });
        urlStr = serviceUrl + "vDimSalesOffice4SalesProfile";
        $http({
            method: "GET",
            url: urlStr,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function mySucces(response) {
            $scope.SalesOffices = response.data.d;
            nLoad++;
            isLoaded();
        }, function myError(response) {
            $scope.status = response.status;
            nLoad++;
            isLoaded();
        });
        urlStr = serviceUrl + "vDimSalesType4SalesProfile";
        $http({
            method: "GET",
            url: urlStr,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function mySucces(response) {
            $scope.SalesTypes = response.data.d;
            nLoad++;
            isLoaded();
        }, function myError(response) {
            $scope.status = response.status;
            nLoad++;
            isLoaded();
        });

    };

    $scope.openMenu = function ($mdOpenMenu, $event) {
        $mdOpenMenu($event);
    };

    $scope.edit = function (exp) {
        var rootScope = $scope.$root;
        currentExp = exp;
        rootScope.field = exp.Field;
        rootScope.value = exp.Value;
        dialogStatus = "edit";
        $scope.showDialog($mdPanel);
    };
    $scope.addInGroup = function (group) {
        var rootScope = $scope.$root;
        currentGroup = group;
        dialogStatus = "addInGroup";
        $scope.showDialog($mdPanel);
    };
    $scope.addGroup = function (group) {
        var rootScope = $scope.$root;
        currentGroup = group;
        dialogStatus = "addGroup";
        $scope.showDialog($mdPanel);
    };
    $scope.changeGroupLogic = function (exp) {
        exp.changeGroupLogic();
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
        //$mdPanel.open(config);
        $("#setFieldValueContainer").show();
        $scope.inputCommon = "";
        searchCommon();
    };
};

function PanelDialogCtrl(mdPanelRef, $scope) {
    $scope.$root.mdPanelRef = mdPanelRef;
};