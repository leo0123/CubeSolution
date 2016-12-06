var app = angular.module('myApp', ['ngMaterial']);
app.controller("myCtrl", function ($scope, $http) {

    var listServer = "http://amdpfwfe02:9999/";
    var dataService = "http://amdpfweb02:8080/SAPBW3DataService.svc/";
    var userUrl = listServer + "_api/SP.UserProfiles.PeopleManager/GetMyProperties";
    //var profileListUrl = listServer + "_api/web/lists/getbytitle('Sales Person Profile')/items";
    var profileListUrl = dataService + "vSalesPersonProfile";
    var dataUrl = dataService + "ActualBudget";
    //var NTAccount = null;
    var BG = "";

    var SalesPerson = "";
    var EndCustomer = "";
    var Material = "";
    var ProfitCenter = "";

    var Year = "";

    var NewSalesPerson = "";

    var YearMonth = "";

    $("#test").hide();
    $("#AngularDiv").hide();
    $scope.selectedYear = "2016";
    $scope.selectedMonth = "01";

    $scope.selectedChanged = function (field) {
        if (field == "SalesPerson") {
            SalesPerson = $scope.selectedSalesPerson;
            $("[title='Sales Person']").val(SalesPerson);
        } else if (field == "EndCustomer") {
            EndCustomer = $scope.selectedEndCustomer;
            $("[title='End Customer']").val(EndCustomer);
        } else if (field == "Material") {
            Material = $scope.selectedMaterial;
            $("[title='Material']").val(Material);
        } else if (field == "ProfitCenter") {
            ProfitCenter = $scope.selectedProfitCenter;
            $("[title='Profit Center']").val(ProfitCenter);
        } else if (field == "NewSalesPerson") {
            NewSalesPerson = $scope.selectedNewSalesPerson;
            $("[title='New Sales Person']").val(NewSalesPerson);
        } else if (field == "NewEndCustomer") {
            NewEndCustomer = $scope.selectedNewEndCustomer;
            $("[title='New End Customer']").val(NewEndCustomer);
        } else if (field == "NewMaterial") {
            NewMaterial = $scope.selectedNewMaterial;
            $("[title='New Material']").val(NewMaterial);
        } else if (field == "Year") {
            Year = $scope.selectedYear;
            $("[title='Year']").val(Year);
            YearMonth = Year + $scope.selectedMonth;
            $("[title='Effective Year Month Required Field']").val(YearMonth);
        } else if (field == "YearMonth") {
            YearMonth = Year + $scope.selectedMonth;
            $("[title='Effective Year Month Required Field']").val(YearMonth);
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
        if (type == "YearMonth") {
            if ($scope.inputYearMonth != null) {
                //$("[title='Effective Year Month Required Field']").val($scope.inputYearMonth);
            }
            return;
        }
        if (type == "BG") {
            setBG($scope.BG);
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
        var urlStr = dataService + "v" + view + "ByBG?$filter=BG eq '" + BG + "'" + filter;
        $http({
            method: "GET",
            url: urlStr,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function mySucces(response) {
            setList(type, response.data.d);
        }, function myError(response) {
            $scope.testhttp = response.status;
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
        $scope.status = response.status;
    });
    function setBG(value) {
        BG = value;
        $("[title='BG Required Field']").val(BG);
        $scope.BG = BG;
        loadOption(BG);
    };

    function loadOption(BG) {
        var url = profileListUrl + "?$top=200&$orderby=DomainAccount&$filter=BG eq '" + BG + "'";
        //$("[title='Sales Person']").val(url);
        $http({
            method: "GET",
            url: url,
            headers: {
                "accept": "application/json;odata=verbose"
            }
        }).then(function mySucces(response) {
            var list = response.data.d;
            $scope.SalesPersons = list;
        }, function myError(response) {
            $scope.status = response.status;
        });
    };

    function getFormValue() {
        BG = $("[title='BG Required Field']").val();

        SalesPerson = $("[title='Sales Person']").val();
        EndCustomer = $("[title='End Customer']").val();
        Material = $("[title='Material']").val();
        ProfitCenter = $("[title='Profit Center']").val();

        Year = $("[title='Year']").val();
    };
    function checkCondition() {
        getFormValue();

        if (SalesPerson == "" && EndCustomer == "" && Material == "") {
            alert("Sales Person and End Customer and Material can't be empty at the same time");
            return false;
        }
        return true;
    };
    function checkValue() {
        if ($("[title='New Sales Person']").val() == ""
			&& $("[title='New End Customer']").val() == ""
			&& $("[title='New Material']").val() == "") {
            alert("New Sales Person and New End Customer and New Material can't be empty at the same time");
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
        //alert($scope.selectedMonth);
        //alert($("[title='Effective Year Month Required Field']").val());
        if (checkCondition() == false) {
            return;
        }

        $scope.searchActualBudget();
        $("#AngularDiv").show();
    });

    $("#AngularClose").click(function () {
        $("#AngularDiv").hide();
    });

    $scope.load1 = function () {
        var condition = "";
        if (SalesPerson != "") {
            condition += " and SalesPerson eq '" + SalesPerson + "'";
            //condition += "&SalesPerson='" + SalesPerson + "'";
        }
        if (EndCustomer != "") {
            condition += " and EndCustomer eq '" + EndCustomer + "'";
            //condition += "&EndCustomer='" + EndCustomer + "'";
        }
        if (Material != "") {
            condition += " and Material eq '" + Material + "'";
            //condition += "&Material='" + Material + "'";
        }
        if (ProfitCenter != "") {
            condition += " and ProfitCenter eq '" + ProfitCenter + "'";
            //condition += "&ProfitCenter='" + ProfitCenter + "'";
        }
        $scope.ActualBudget = null;
        $scope.status = "loading";
        //$("#test").val(dataUrl + "?$filter=BG eq '" + BG + "' and Year eq '" + Year + "' " + condition);
        $http({
            method: "GET",
            url: dataUrl + "?$filter=BG eq '" + BG + "' and Year eq '" + Year + "' " + condition,
            //url: dataUrl + "?Year='" + Year + "'&BG='" + BG + "'" + condition,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function mySucces(response) {
            $scope.ActualBudget = response.data.d;
            var myDate = new Date();
            $scope.status = "loaded at " + myDate.toLocaleTimeString();
        }, function myError(response) {
            $scope.status = response.status;
            alert("done");
        });
    };
    $scope.searchActualBudget = function () {
        var condition = "";
        if (SalesPerson != "") {
            condition += "&SalesPerson='" + SalesPerson + "'";
        }
        if (EndCustomer != "") {
            condition += "&EndCustomer='" + EndCustomer + "'";
        }
        if (Material != "") {
            condition += "&Material='" + Material + "'";
        }
        if (ProfitCenter != "") {
            condition += "&ProfitCenter='" + ProfitCenter + "'";
        }
        $scope.ActualBudget = null;
        $scope.status = "loading";
        $("#test").val(dataService + "getActualBudget?Year='" + Year + "'&BG='" + BG + "'" + condition);
        $http({
            method: "GET",
            url: dataService + "getActualBudget?Year='" + Year + "'&BG='" + BG + "'" + condition,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function mySucces(response) {
            $scope.ActualBudget = response.data.d;
            var myDate = new Date();
            $scope.status = "loaded at " + myDate.toLocaleTimeString();
        }, function myError(response) {
            $scope.status = response.status;
            alert("done");
        });
    };

});