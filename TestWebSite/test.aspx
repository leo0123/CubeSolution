<%@ Page Language="C#" AutoEventWireup="true" CodeFile="test.aspx.cs" Inherits="test" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <%--<link rel="stylesheet" href="scripts/bower_components/lumx/dist/lumx.css">--%>
    <%--<script src="scripts/bower_components/jquery/dist/jquery.js"></script>
    <script src="scripts/bower_components/velocity/velocity.js"></script>
    <script src="scripts/bower_components/moment/min/moment-with-locales.js"></script>
    <script src="scripts/bower_components/angular/angular.js"></script>
    <script src="scripts/bower_components/lumx/dist/lumx.js"></script>--%>
    <link href="scripts/bower_components/angular-material/angular-material.css" rel="stylesheet" />
    <script src="scripts/bower_components/angular/angular.js" type="text/javascript" ></script>
    <script src="scripts/bower_components/angular-animate/angular-animate.js" type="text/javascript" ></script>
    <script src="scripts/bower_components/angular-aria/angular-aria.js" type="text/javascript" ></script>
    <script src="scripts/bower_components/angular-material/angular-material.js" type="text/javascript" ></script>
    <%--<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular.min.js"></script>--%>

    <script src="Expression.js"></script>
    <script src="ExpressionManager.js"></script>
    <script src="ExpressionAngular.js"></script>
    <style>
        .inline {
            display: inline;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">

<div ng-app="myApp" ng-controller="myCtrl">
    <md-button ng-click="test()" class="md-fab md-mini md-primary">test</md-button>
    <%--<lx-button lx-type="icon"><i class="mdi mdi-plus"></i></lx-button>--%>
    {{root | json}}

    <div ng-show="showDialog" style="left:500px;top:000px;position:fixed;background-color:azure;width:200px;height:200px;">
        <p>Field : <input type="text" ng-model="field"></p>
        <p>Value : <input type="text" ng-model="value"></p>
        <md-button ng-click="save()" class="md-fab md-mini md-primary">ok</md-button>
    </div>
 	<h1>Input {{field}}{{value}}</h1>
    <h1>Return {{return}}</h1>
    
    <md-button ng-if="root.Children.length == 0" ng-click="addInGroup(root)" class="md-fab md-mini md-primary">+</md-button>

    <script type="text/ng-template" id="expTree">
        <div class="inline" ng-if="tempExp.IsGroup == false">
            <div class="inline" ng-click="changeGroupLink(tempExp)">{{tempExp.getGroupLink()}}</div>{{tempExp.Field}}={{tempExp.Value}}
        </div>
        <div class="inline" ng-if="tempExp.IsGroup == true && tempExp.Children.length > 0">
            <div class="inline" ng-click="changeGroupLink(tempExp)">{{tempExp.getGroupLink()}}</div>
            (
            <div class="inline" ng-repeat="tempExp in tempExp.Children" ng-include="'expTree'">

            </div>
            <md-button ng-click="addInGroup(tempExp)" class="md-fab md-mini md-primary">+</md-button>
            )
            <md-button ng-click="addGroup(tempExp)" class="md-fab md-mini md-primary">+</md-button>
        </div>
    </script>

    <div class="inline" ng-if="root.Children.length > 0">
        (
        <div class="inline" ng-repeat="tempExp in root.Children" ng-include="'expTree'">

        </div>
        <md-button ng-click="addInGroup(root)" class="md-fab md-mini md-primary">+</md-button>
        )
        <md-button ng-click="addGroup(root)" class="md-fab md-mini md-primary">+</md-button>
    </div>
</div>

    </form>
</body>
</html>
