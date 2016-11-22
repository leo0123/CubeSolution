var app = angular.module("myApp", []);
app.controller("myCtrl", function ($scope, $http) {

    var dataUrl = "http://amdpfweb02:8080/SAPBW3DataService.svc/vBudget_New";
    var NTAccount = null;
    var BG = "FMBG";
    var Period_Year = "2016";
    var FrontEndSales = "";
    var EndCustomer = "";
    var Material = "";
    var ProfitCenter = "";

    $("#btSearch").click(function () {
        FrontEndSales = $("[title='Sales Person']").val();
        EndCustomer = $("[title='End Customer']").val();
        Material = $("[title='Material']").val();
        ProfitCenter = $("[title='Profit Center']").val();

        //FrontEndSales = "STEVEN.SALATA";

        if (FrontEndSales == "" && EndCustomer == "") {
            alert("Sales Person and End Customer can't be empty at the same time");
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
        if (FrontEndSales != "") {
            condition += " and FrontEndSales eq '" + FrontEndSales + "'";
        }
        if (EndCustomer != "") {
            condition += " and EndCustomer eq '" + EndCustomer + "'";
        }
        if (Material != "") {
            condition += " and Material eq '" + Material + "'";
        }
        if (ProfitCenter != "") {
            condition += " and ProfitCenter eq '" + ProfitCenter + "'";
        }
        $http({
            method: "GET",
            url: dataUrl + "?$filter=BG eq '" + BG + "' and Period_Year eq '" + Period_Year + "' " + condition,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function mySucces(response) {
            $scope.Budget = response.data.d;
        }, function myError(response) {
            $scope.status = response.status;
        });
    };
});