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
    <%--<script src="scripts/bower_components/angular-messages/angular-messages.js"  type="text/javascript" ></script>--%>
    <script src="scripts/bower_components/angular-material/angular-material.js" type="text/javascript" ></script>
    <%--<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular.min.js"></script>--%>

    <script src="Expression.js"></script>
    <script src="ExpressionManager.js"></script>
    <script src="ExpressionAngular.js"></script>
    <style>
        .inline {
            display: inline;
        }
        .demo-dialog-example {
  background: white;
  border-radius: 4px;
  box-shadow: 0 7px 8px -4px rgba(0, 0, 0, 0.2),
      0 13px 19px 2px rgba(0, 0, 0, 0.14),
      0 5px 24px 4px rgba(0, 0, 0, 0.12);
  width: 200px;
}
    </style>
</head>
<body>
    <form id="form1" runat="server">
<div ng-app="myApp">
<div ng-controller="myCtrl">
    <h1>{{testhttp}}</h1>
    <md-button ng-click="test()">test</md-button>
    <md-button ng-click="load()">load</md-button>
    <md-button ng-click="save()">save</md-button>
    <div>{{root | json}}</div>
    <br />
    <div>{{root.ToString()}}</div>

    <br />
    
    <md-button ng-if="root.Children.length == 0" ng-click="addInGroup(root)" class="md-fab md-mini md-primary">+</md-button>
    <script type="text/ng-template" id="panel.tmpl.html">
        <p>Field : <input type="text" ng-model="$root.field"></p>
        <p>Value : <input type="text" ng-model="$root.value"></p>
        <md-button ng-click="$root.save()" class="md-fab md-mini md-primary">ok</md-button>
    </script>

    <script type="text/ng-template" id="expTree">
        <div class="inline" ng-if="tempExp.IsGroup == false">
            <md-menu ng-if="tempExp.getGroupLogic() != ''">
                <md-button class="md-no-style1" ng-click="openMenu($mdOpenMenu, $event)">{{tempExp.getGroupLogic()}}</md-button>
                <md-menu-content>
                    <md-menu-item>
                      <md-button class="md-no-style1" ng-click="changeGroupLogic(tempExp)">and / or</md-button>
                    </md-menu-item>
                </md-menu-content>
            </md-menu>
            <md-menu>
                <md-button class="md-no-style1" ng-click="openMenu($mdOpenMenu, $event)">{{tempExp.Field}}={{tempExp.Value}}</md-button>
                <md-menu-content>
                    <md-menu-item>
                        <md-button class="md-no-style1" ng-click="edit(tempExp)">edit</md-button>
                    </md-menu-item>
                </md-menu-content>
            </md-menu>
        </div>
        <div class="inline" ng-if="tempExp.IsGroup == true && tempExp.Children.length > 0">
            <md-menu ng-if="tempExp.getGroupLogic() != ''">
                <md-button class="md-no-style1" ng-click="openMenu($mdOpenMenu, $event)">{{tempExp.getGroupLogic()}}</md-button>
                <md-menu-content>
                    <md-menu-item>
                      <md-button class="md-no-style1" ng-click="changeGroupLogic(tempExp)">and / or</md-button>
                    </md-menu-item>
                </md-menu-content>
            </md-menu>
            (
            <div class="inline" ng-repeat="tempExp in tempExp.Children" ng-include="'expTree'">

            </div>
            <md-menu>
                <md-button class="md-no-style1" ng-click="openMenu($mdOpenMenu, $event)">)</md-button>
                <md-menu-content>
                    <md-menu-item>
                      <md-button class="md-no-style1" ng-click="addInGroup(tempExp)">add in group</md-button>
                    </md-menu-item>
                    <md-menu-item>
                      <md-button class="md-no-style1" ng-click="addGroup(tempExp)">add after group</md-button>
                    </md-menu-item>
                </md-menu-content>
            </md-menu>
        </div>
    </script>

    <div class="inline" ng-if="root.Children.length > 0">
        (
        <div class="inline" ng-repeat="tempExp in root.Children" ng-include="'expTree'">

        </div>
        <md-menu>
            <md-button class="md-no-style1" ng-click="openMenu($mdOpenMenu, $event)">)</md-button>
            <md-menu-content>
                <md-menu-item>
                  <md-button class="md-no-style1" ng-click="addInGroup(root)">add in group</md-button>
                </md-menu-item>
                <md-menu-item>
                  <md-button class="md-no-style1" ng-click="addGroup(root)">add after group</md-button>
                </md-menu-item>
            </md-menu-content>
        </md-menu>
    </div>
</div>
</div>
    </form>
</body>
</html>
