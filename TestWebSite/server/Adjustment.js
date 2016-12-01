var app = angular.module("myApp", []);
app.controller("myCtrl", function ($scope, $http) {

    var dataUrl = "http://amdpfweb02:8080/SAPBW3DataService.svc/proc_getActualBudget";
    var NTAccount = null;
    var BG = "";
    var Year = "";
    var SalesPerson = "";
    var EndCustomer = "";
    var Material = "";
    var ProfitCenter = "";

    //$("[value='Save']").prop( "disabled", true );

    $("#btSearch").click(function () {
        Year = $("[title='Year']").val();
        BG = $("[title='BG Required Field']").val();
        SalesPerson = $("[title='Sales Person']").val();
        EndCustomer = $("[title='End Customer']").val();
        Material = $("[title='Material']").val();
        ProfitCenter = $("[title='Profit Center']").val();

        if (SalesPerson == "" && EndCustomer == "" && Material == "") {
            alert("Sales Person and End Customer and Material can't be empty at the same time");
            return;
        }

        $scope.load();
        $("#AngularDiv").show();
    });

    $("#AngularClose").click(function () {
        $("#AngularDiv").hide();
    });

    $scope.load = function () {
        var condition = "";
        if (SalesPerson != "") {
            //condition += " and FrontEndSales eq '" + FrontEndSales + "'";
            condition += "&SalesPerson='" + SalesPerson + "'";
        }
        if (EndCustomer != "") {
            //condition += " and EndCustomer eq '" + EndCustomer + "'";
            condition += "&EndCustomer='" + EndCustomer + "'";
        }
        if (Material != "") {
            //condition += " and Material eq '" + Material + "'";
            condition += "&Material='" + Material + "'";
        }
        if (ProfitCenter != "") {
            //condition += " and ProfitCenter eq '" + ProfitCenter + "'";
            condition += "&ProfitCenter='" + ProfitCenter + "'";
        }
        $scope.ActualBudget = null;
        $scope.status = "loading";
        $http({
            method: "GET",
            //url: dataUrl + "?$filter=BG eq '" + BG + "' and Period_Year eq '" + Period_Year + "' " + condition,
            url: dataUrl + "?Year='" + Year + "'&BG='" + BG + "'" + condition,
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