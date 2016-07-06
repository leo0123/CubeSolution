var app = angular.module('myApp', ['ngMaterial']);
app.service('expM', ExpressionManager);
app.controller('myCtrl', function ($scope, expM) {
    var tt = '{ "IsGroup": true, "Field": null, "Value": null, "GroupLink": " or ", "Children": [ { "IsGroup": false, "Field": "a", "Value": "a", "GroupLink": "", "Children": null }, { "IsGroup": false, "Field": "b", "Value": "b", "GroupLink": "", "Children": null } ] }';
    var t = angular.fromJson(tt);
    //expM.setRoot(t);
    $scope.root = expM.getRoot();
    $scope.test = function () {
        if (expM.getRoot() instanceof Expression) {
            $scope.return = "yes";
        } else {
            $scope.return = "no";
        }
        //$scope.return = expM.getRoot().ToString();
        
        //$scope.root = expM.getRoot();
        //expM.getRoot().test();

    };
    $scope.save = function () {
        if ($scope.dialogStatus == "addInGroup") {
            expM.add($scope.currentGroup, $scope.field, $scope.value);
        }
        else if ($scope.dialogStatus == "edit") {
            $scope.currentExp.setFieldValue($scope.field, $scope.value);
        }
        else if ($scope.dialogStatus == "addGroup") {
            expM.addGroup($scope.currentGroup, $scope.field, $scope.value);
            $scope.root = expM.getRoot();
        }
        $scope.return = expM.getRoot().Children.length;
        //$scope.children = expM.getRoot().getChildren();
        $scope.showDialog = false;
    };
    $scope.edit = function (exp) {
        $scope.showDialog = true;
        $scope.currentExp = exp;
        $scope.field = exp.Field;
        $scope.value = exp.Value;
        $scope.dialogStatus = "edit";
    }
    $scope.addInGroup = function (group) {
        $scope.currentGroup = group;
        $scope.showDialog = true;
        
        $scope.dialogStatus = "addInGroup";
    };
    $scope.addGroup = function (group) {
        $scope.currentGroup = group;
        $scope.showDialog = true;

        $scope.dialogStatus = "addGroup";
    }
    $scope.changeGroupLink = function (exp) {
        exp.changeGroupLink();
    }
});