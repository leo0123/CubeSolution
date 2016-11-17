var app = angular.module("myApp", []);
app.controller("myCtrl", function ($scope, $http) {
    var account = NTAccount.substring(13);
    //alert(account);
    $http({
        method: "GET",
        url: "http://amdpfweb02:8080/SAPBW3DataService.svc/vSalesCustomer?$filter=SALES_ACCOUNT eq '" + account + "'",
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    }).then(function mySucces(response) {
        $scope.Customers = response.data.d;
        //$scope.searchProfitCenterResult = 'click to select ProfitCenter';

    }, function myError(response) {
        $scope.status = response.status;
    })
});