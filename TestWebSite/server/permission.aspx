<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%@ Page Language="C#" %>
<%@ Register tagprefix="SharePoint" namespace="Microsoft.SharePoint.WebControls" assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml">

<head runat="server">
<meta name="WebPartPageExpansion" content="full" />
<meta http-equiv="X-UA-Compatible" content="IE=10" />
<SharePoint:CssRegistration Name="default" runat="server"/>
<link href="scripts/bower_components/angular-material/angular-material.css" rel="stylesheet" />
    <script src="scripts/bower_components/angular/angular.js" type="text/javascript"></script>
    <script src="scripts/bower_components/angular-animate/angular-animate.js" type="text/javascript"></script>
    <script src="scripts/bower_components/angular-aria/angular-aria.js" type="text/javascript"></script>

    <script src="scripts/bower_components/angular-material/angular-material.js" type="text/javascript"></script>


    <script src="scripts/Expression.js"></script>
    <script src="scripts/CustomizeExpression.js"></script>
    <script src="scripts/ExpressionManager.js"></script>
    <script src="scripts/CustomizeExpressionManager.js"></script>
    <script src="scripts/ExpressionAngular.js"></script>
    <style>
        .inline {
            display: inline;
        }

        .demo-dialog-example {
            background: white;
            border-radius: 4px;
            box-shadow: 0 7px 8px -4px rgba(0, 0, 0, 0.2), 0 13px 19px 2px rgba(0, 0, 0, 0.14), 0 5px 24px 4px rgba(0, 0, 0, 0.12);
            width: 200px;
        }
    </style>
</head>

<body>

<form id="form1" runat="server">
<div ng-app="myApp">
        <div ng-controller="myCtrl">
            <h1>{{DomainAccount}}</h1>{{status}}
            <md-button ng-click="loadOption()">loadOption</md-button>{{msg}}
            <md-progress-circular ng-show="waiting" md-mode="indeterminate"></md-progress-circular>
            <md-tabs md-selected="selectedTabIndex" md-dynamic-height md-border-bottom>
                <md-tab label="BG">
                    <md-input-container>
                        <%--<label>click to select BG</label>--%>
                        <md-select ng-model="selectedBG" ng-change="selectedChanged('BGCode')" multiple placeholder="Select BG">
                            <%--<md-optgroup>
                                --%>
                                <md-option ng-value="item.BGCode" ng-repeat="item in BGs">{{item.BGCode}}</md-option>
                                <%--
                            </md-optgroup>--%>
                        </md-select>
                    </md-input-container>
                    <md-button ng-click="nextTab()">next</md-button>
                </md-tab>
                <md-tab label="ProfitCenter">
                    <md-button ng-click="previousTab()">previous</md-button>
                    <md-input-container style="width:200px">
                        <md-select ng-model="selectedProfitCenter" ng-change="selectedChanged('ProfitCenterCode')" multiple placeholder="input at least 2 letters">
                            <md-select-header>
                                <input ng-model="inputProfitCenter"
                                       ng-change="inputProfitCenterChanged()"
                                       ng-keydown="onSearchChange($event)" />
                            </md-select-header>
                            <%--<md-optgroup label="ProfitCenter List">
                                --%>
                                <md-option ng-value="item.ProfitCenterCode" ng-repeat="item in ProfitCenters | filter:inputProfitCenter">{{item.ProfitCenterCode}}</md-option>
                                <%--
                            </md-optgroup>--%>
                        </md-select>
                    </md-input-container>
                    <md-button ng-click="nextTab()">next</md-button>
                </md-tab>
                <md-tab label="SalesP">
                    <md-button ng-click="previousTab()">previous</md-button>
                    <md-input-container>
                        <%--<label>click to select SalesP</label>--%>
                        <md-select ng-model="selectedSalesP" ng-change="selectedChanged('SalesP')" multiple placeholder="Select SalesP">
                            <%--<md-optgroup label="SalesP List">
                                --%>
                                <md-option ng-value="item.SalesP" ng-repeat="item in SalesPs">{{item.SalesP}}</md-option>
                                <%--
                            </md-optgroup>--%>
                        </md-select>
                    </md-input-container>
                    <md-button ng-click="nextTab()">next</md-button>
                </md-tab>
                <md-tab label="Office">
                    <md-button ng-click="previousTab()">previous</md-button>
                    <md-input-container>
                        <%--<label>click to select Office</label>--%>
                        <md-select ng-model="selectedOffice" ng-change="selectedChanged('Office')" multiple placeholder="Select Office">
                            <%--<md-optgroup label="Office List">
                                --%>
                                <md-option ng-value="item.Office" ng-repeat="item in Offices">{{item.Office}}</md-option>
                                <%--
                            </md-optgroup>--%>
                        </md-select>
                    </md-input-container>
                    <md-button ng-click="nextTab()">next</md-button>
                </md-tab>
                <md-tab label="SalesOffice">
                    <md-button ng-click="previousTab()">previous</md-button>
                    <md-input-container>
                        <%--<label>click to select SalesOffice</label>--%>
                        <md-select ng-model="selectedSalesOffice" ng-change="selectedChanged('SalesOffice')" multiple placeholder="Select SalesOffice">
                            <%--<md-optgroup label="SalesOffice List">
                                --%>
                                <md-option ng-value="item.SalesOffice" ng-repeat="item in SalesOffices">{{item.SalesOffice}}</md-option>
                                <%--
                            </md-optgroup>--%>
                        </md-select>
                    </md-input-container>
                    <md-button ng-click="nextTab()">next</md-button>
                </md-tab>
                <md-tab label="SalesType">
                    <md-button ng-click="previousTab()">previous</md-button>
                    <md-input-container>
                        <%--<label>click to select SalesType</label>--%>
                        <md-select ng-model="selectedSalesType" ng-change="selectedChanged('SalesTypeName')" multiple placeholder="Select SalesType">
                            <%--<md-optgroup label="SalesType List">
                                --%>
                                <md-option ng-value="item.SalesTypeName" ng-repeat="item in SalesTypes">{{item.SalesTypeName}}</md-option>
                                <%--
                            </md-optgroup>--%>
                        </md-select>
                    </md-input-container>
                    <md-button ng-click="nextTab()">next</md-button>
                </md-tab>
                <md-tab label="EndCustomer">
                    <md-button ng-click="previousTab()">previous</md-button>
                    <%--<input ng-model="inputEndCustomer" ng-change="inputEndCustomerChanged()" />--%>
                    <md-input-container>
                        <%--<label ng-init="searchEndCustomerResult = 'key word is too short'">{{searchEndCustomerResult}}</label>--%>
                        <%--<label>search EndCustomer...</label>--%>
                        <md-select ng-model="selectedEndCustomer" ng-change="selectedChanged('EndCustomerName')" multiple placeholder="input at least 2 letters">
                            <md-select-header>
                                <input ng-model="inputEndCustomer"
                                       ng-change="inputEndCustomerChanged()"
                                       ng-keydown="onSearchChange($event)" />
                            </md-select-header>
                            <%--<md-optgroup label="EndCustomer List">
                                --%>
                                <md-option ng-value="item.CustomerEntityName" ng-repeat="item in EndCustomers | filter:inputEndCustomer">{{item.CustomerEntityName}}</md-option>
                                <%--
                            </md-optgroup>--%>
                        </md-select>
                    </md-input-container>
                    <md-button ng-click="nextTab()">next</md-button>
                </md-tab>
                <md-tab label="SoldToCustomer">
                    <md-button ng-click="previousTab()">previous</md-button>
                    <%--<input ng-model="inputSoldToCustomer" ng-change="inputSoldToCustomerChanged()" />--%>
                    <md-input-container>
                        <%--<label ng-init="searchSoldToCustomerResult = 'key word is too short'">{{searchSoldToCustomerResult}}</label>--%>
                        <%--<label>search SoldToCustomer...</label>--%>
                        <md-select ng-model="selectedSoldToCustomer" ng-change="selectedChanged('SoldToCustomerName')" multiple placeholder="input at least 3 letters">
                            <md-select-header>
                                <input ng-model="inputSoldToCustomer"
                                       ng-change="inputSoldToCustomerChanged()"
                                       ng-keydown="onSearchChange($event)" />
                            </md-select-header>
                            <%--<md-optgroup label="SoldToCustomer List">
                                --%>
                                <md-option ng-value="item.CustomerName" ng-repeat="item in SoldToCustomers | filter:inputSoldToCustomer">{{item.CustomerName}}</md-option>
                                <%--
                            </md-optgroup>--%>
                        </md-select>
                    </md-input-container>
                </md-tab>
                <%--<md-tab label="SoldToCustomer">
                    <md-button ng-click="previousTab()">previous</md-button>
                    <input ng-model="inputSoldToCustomer" ng-change="inputSoldToCustomerChanged()" />
                    <md-input-container>
                        <label ng-init="searchSoldToCustomerResult = 'key word is too short'">{{searchSoldToCustomerResult}}</label>
                        <md-select ng-model="selectedSoldToCustomer" ng-change="selectedChanged('SoldToCustomerName')" multiple>
                            <md-optgroup label="SoldToCustomer List">
                                <md-option ng-value="item.CustomerName" ng-repeat="item in SoldToCustomers | filter:inputSoldToCustomer">{{item.CustomerName}}</md-option>
                            </md-optgroup>
                        </md-select>
                    </md-input-container>
                </md-tab>--%>
            </md-tabs>

            <div ng-if="1==1">
                <md-button ng-click="load()">load</md-button>
                <md-button ng-click="save()">save</md-button>
                <div>{{root | json}}</div>
                <br />
                <div>{{root.ToString()}}</div>
            </div>
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
