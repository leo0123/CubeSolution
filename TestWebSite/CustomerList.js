var app = angular.module("myApp", []);
app.controller("myCtrl", function ($scope) {
    $scope.records = [
       {
           "Name": "Alfreds Futterkiste",
           "Country": "Germany"
       }, {
           "Name": "Berglunds snabbköp",
           "Country": "Sweden"
       }, {
           "Name": "Centro comercial Moctezuma",
           "Country": "Mexico"
       }, {
           "Name": "Ernst Handel",
           "Country": "Austria"
       }
    ]
});