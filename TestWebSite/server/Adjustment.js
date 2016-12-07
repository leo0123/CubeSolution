var app = angular.module('myApp', ['ngMaterial']);
app.controller("myCtrl", function ($scope, $http) {

    var listServer = "http://amdpfwfe02:9999/";
    var dataService = "http://amdpfweb02:8080/SAPBW3DataService.svc/";
    var userUrl = listServer + "_api/SP.UserProfiles.PeopleManager/GetMyProperties";
    //var profileListUrl = listServer + "_api/web/lists/getbytitle('Sales Person Profile')/items";
    var profileListUrl = dataService + "vSalesPersonProfile";
    var dataUrl = dataService + "ActualBudget";

    var BG = $("[title='BG Required Field']");

    var SalesPerson = $("[title='Sales Person']");
    var EndCustomer = $("[title='End Customer']");
    var Material = $("[title='Material']");
    var ProfitCenter = $("[title='Profit Center']");

    var Year = $("[title='Year']");

    var NewSalesPerson = $("[title='New Sales Person']");
    var NewEndCustomer = $("[title='New End Customer']");
    var NewMaterial = $("[title='New Material']");

    var YearMonth = $("[title='Effective Year Month Required Field']");

    var msg = $("#msg");

    $scope.selectedYear = "2016";
    Year.val("2016");
    $scope.selectedMonth = "01";
    YearMonth.val("201601");

    $scope.selectedChanged = function (field) {
        if (field == "SalesPerson") {
            SalesPerson.val($scope.selectedSalesPerson);
        } else if (field == "EndCustomer") {
            EndCustomer.val($scope.selectedEndCustomer);
        } else if (field == "Material") {
            Material.val($scope.selectedMaterial);
        } else if (field == "ProfitCenter") {
            ProfitCenter.val($scope.selectedProfitCenter);
        } else if (field == "NewSalesPerson") {
            NewSalesPerson.val($scope.selectedNewSalesPerson);
        } else if (field == "NewEndCustomer") {
            NewEndCustomer.val($scope.selectedNewEndCustomer);
        } else if (field == "NewMaterial") {
            NewMaterial.val($scope.selectedNewMaterial);
        } else if (field == "Year") {
            Year.val($scope.selectedYear);
            YearMonth.val(Year.val() + $scope.selectedMonth);
        } else if (field == "YearMonth") {
            YearMonth.val(Year.val() + $scope.selectedMonth);
        }
    };

    function setList(type, list) {
        if (type == "EndCustomer") {
            $scope.EndCustomers = list;
        } else if (type == "Material") {
            $scope.Materials = list;
        } else if (type == "ProfitCenter") {
            $scope.ProfitCenters = list;
        } else if (type == "NewEndCustomer") {
            $scope.NewEndCustomers = list;
        } else if (type == "NewMaterial") {
            $scope.NewMaterials = list;
        }
    };

    $scope.inputChanged = function (value, type) {
        if (type == "BG") {
            setBG(value);
            return;
        }
        if (value.length >= 1) {
            var field = type;
            if (field.startsWith("New")) {
                field = field.substring(3, field.length);
            }
            var filter = "indexof(" + field + ", '" + value + "') ge 0";
            searchOptionByBG(filter, type);
        }
        else if (value.length < 1) {
            setList(type, []);
        };
    };

    $scope.onSearchChange = function (event) {
        event.stopPropagation();
    };

    function searchOptionByBG(filter, type) {
        if (filter != '') {
            filter = " and " + filter;
        }
        var view = type;
        if (view.startsWith("New")) {
            view = view.substring(3, view.length);
        }
        var urlStr = dataService + "v" + view + "ByBG?$filter=BG eq '" + BG.val() + "'" + filter;
        $http({
            method: "GET",
            url: urlStr,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function mySucces(response) {
            setList(type, response.data.d);
        }, function myError(response) {
            msg.text(response.status);
        })
    };

    function getDept(prop) {
        return prop.Key == "Department";
    };

    $http({
        method: "GET",
        url: userUrl,
        headers: {
            "accept": "application/json;odata=verbose"
        }
    }).then(function mySucces(response) {
        setBG(response.data.d.UserProfileProperties.results.find(getDept).Value);
    }, function myError(response) {
        msg.text(response.status);
    });
    function setBG(value) {
        BG.val(value);
        $scope.BG = value;
        loadOption(value);
    };

    function loadOption(e) {
        var url = profileListUrl + "?$top=999&$orderby=DomainAccount&$filter=BG eq '" + e + "'";
        $http({
            method: "GET",
            url: url,
            headers: {
                "accept": "application/json;odata=verbose"
            }
        }).then(function mySucces(response) {
            $scope.SalesPersons = response.data.d;
        }, function myError(response) {
            msg.text(response.status);
        });
    };

    function checkCondition() {
        if (SalesPerson.val() == "" && EndCustomer.val() == "" && Material.val() == "") {
            msg.text("Sales Person and End Customer and Material can't be empty at the same time");
            alert(msg.text());
            return false;
        }
        return true;
    };
    function checkValue() {
        if (NewSalesPerson.val() == "" && NewEndCustomer.val() == "" && NewMaterial.val() == "") {
            msg.text("New Sales Person and New End Customer and New Material can't be empty at the same time");
            alert(msg.text());
            return false;
        }
        return true;
    }

    $("#btSave").click(function () {
        if (checkCondition() == false) {
            return;
        }
        if (checkValue() == false) {
            return;
        }
        $("[value='Save']").click()
    });

    $("#btCancel").click(function () {
        $("[value='Cancel']").click()
    });

    $("#btSearch").click(function () {
        $scope.searchActualBudget();
    });

    $scope.searchActualBudget = function () {
        msg.text("");
        $scope.ActualBudget = null;
        if (checkCondition() == false) {
            return;
        }

        $scope.status = "loading";
        var condition = "Year='" + Year.val() + "'&BG='" + BG.val() + "'";
        if (SalesPerson.val() != "") {
            condition += "&SalesPerson='" + SalesPerson.val() + "'";
        }
        if (EndCustomer.val() != "") {
            condition += "&EndCustomer='" + EndCustomer.val() + "'";
        }
        if (Material.val() != "") {
            condition += "&Material='" + Material.val() + "'";
        }
        if (ProfitCenter.val() != "") {
            condition += "&ProfitCenter='" + ProfitCenter.val() + "'";
        }
        $scope.status = "loading:" + condition;
        $http({
            method: "GET",
            url: dataService + "getActualBudget?" + condition,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function mySucces(response) {
            $scope.ActualBudget = response.data.d;
            var myDate = new Date();
            $scope.status = "loaded at " + myDate.toLocaleTimeString();
        }, function myError(response) {
            $scope.status = "error:" + condition;
            alert("error");
        });
    };
});