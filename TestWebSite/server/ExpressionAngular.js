var app = angular.module('myApp', ['ngMaterial']);

var expM = new CustomizeExpressionManager();
var currentExp;
var currentGroup;
var dialogStatus;
var spPermission;
var spJSONStr;
var spDepartment;
var theBG;

function log(str) {
	console.log(str);
}

app.run(function ($rootScope, $location) {
	var rootScope = $rootScope;

	dialogStatus = 'status';
	rootScope.expRoot = expM.getRoot();
	rootScope.mdPanelRef = null;
});
app.controller('myCtrl', myCtrl);
//app.controller('PanelDialogCtrl', PanelDialogCtrl);

var serviceUrl = "http://amdpfweb02:8080/SAPBW3DataService.svc/";
var digestUrl = "http://amdpfwfe02:9999/_api/contextinfo";

function myCtrl($scope, $mdPanel, $http, $location) {
	var rootScope = $scope.$root;
	$scope.theOptionLists = new OptionLists();
	spPermission = $("[title='Permission']");
	spJSONStr = $("[title='JSONStr']");
	spDepartment = $("[title='Department']");

	$("#setFieldValueContainer").hide();
	$("#permissionEditor").hide();
	$("#btPermissionEditor").click(function () {
		theBG = spDepartment.val();
		log(theBG);
		if (theBG == "") {
			return;
		}
		$("#permissionEditor").show();
		if (nLoad != 0) {
			loadOption();
		}
		if (spJSONStr.val() != "") {
			setRoot(angular.fromJson(spJSONStr.val()));
		}
		rootScope.$apply();
	});
	$("#btPermissionOK").click(function () {
		spJSONStr.val(angular.toJson(expM.getRoot()));
		spPermission.val(expM.getRoot().ToString());
		$("#permissionEditor").hide();
	});
	$("#btPermissionCancel").click(function () {
		$("#permissionEditor").hide();
	});
	$("#btSetFieldValueOK").click(function () {
		var value = "'" + $scope.singleValue + "'";
		if (dialogStatus == "addInGroup") {
			expM.add(currentGroup, $scope.singleField, value);
		} else if (dialogStatus == "edit") {
			currentExp.setFieldValue($scope.singleField, value);
		} else if (dialogStatus == "addGroup") {
			expM.addGroup(currentGroup, $scope.singleField, value);
			rootScope.expRoot = expM.getRoot();
		}
		$("#setFieldValueContainer").hide();
		rootScope.$apply();
	});
	$("#btSetFieldValueCancel").click(function () {
		$("#setFieldValueContainer").hide();
	});

	setRoot = function (jsonObject) {
		expM.setRoot(jsonObject);
		rootScope.expRoot = expM.getRoot();
		rootScope.$apply();
	};
	var listUrl = "http://amdpfwfe02:9999/_api/web/lists/getbytitle('Sales Person Profile')/items(" + $scope.$root.id + ")";
	$scope.onSearchChange = function (event) {
		event.stopPropagation();
	};

	$scope.inputCommonChanged = function () {
		searchCommon();
	};
	searchCommon = function () {
		var view;
		var l = 0;
		var list = $scope.theOptionLists.getList($scope.singleField);
		if ($scope.singleField == $scope.theOptionLists.SoldToCustomerStr) {
			view = "vDimCustomer4SalesProfile";
			l = 2;
		}
		if ($scope.inputCommon.length < l) {
			$scope.commonList = [];
			return;
		}
		if ($scope.inputCommon.length > l) {
			return;
		}
		if ($scope.singleField != undefined && list == null) {
			var filter = "";
			if ($scope.inputCommon != "") {
				filter = "?$filter=indexof(Value, '" + $scope.inputCommon + "') ge 0";
			}
			var urlStr = serviceUrl + view + filter;
			$http({
				method: "GET",
				url: urlStr,
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				}
			}).then(function mySucces(response) {
				$scope.commonList = response.data.d;
			}, function myError(response) {
				$scope.status = response.status;
			})
		} else {
			$scope.commonList = list;
		}
	};

	$scope.inputSoldToCustomerChanged = function () {
		if ($scope.inputSoldToCustomer.length == 3) {
			var filter = "indexof(Value, '" + $scope.inputSoldToCustomer + "') ge 0";
			searchSoldToCustomer(filter);
		} else if ($scope.inputSoldToCustomer.length < 3) {
			$scope.SoldToCustomers = [];
		};
	};
	searchSoldToCustomer = function myfunction(filter) {
		var urlStr = serviceUrl + "vDimCustomer4SalesProfile?$filter=" + filter;
		$http({
			method: "GET",
			url: urlStr,
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			}
		}).then(function mySucces(response) {
			$scope.SoldToCustomers = response.data.d;
		}, function myError(response) {
			$scope.status = response.status;
		})
	};
	$scope.selectedChanged = function (field) {
		var list = null;
		if (field == $scope.theOptionLists.BGStr) {
			list = $scope.selectedBG;
		} else if (field == $scope.theOptionLists.ProfitCenterStr) {
			list = $scope.selectedProfitCenter;
		} else if (field == $scope.theOptionLists.SalesPStr) {
			list = $scope.selectedSalesP;
		} else if (field == $scope.theOptionLists.EndCustomerStr) {
			list = $scope.selectedEndCustomer;
		} else if (field == $scope.theOptionLists.SoldToCustomerStr) {
			list = $scope.selectedSoldToCustomer;
		} else if (field == $scope.theOptionLists.OfficeStr) {
			list = $scope.selectedOffice;
		} else if (field == $scope.theOptionLists.SalesOfficeStr) {
			list = $scope.selectedSalesOffice;
		} else if (field == $scope.theOptionLists.SalesTypeStr) {
			list = $scope.selectedSalesType;
		} else if (field == "singleField") {
			$scope.singleValue = "";
			$scope.inputCommon = "";
			searchCommon();
		}

		expM.clearGroup(field);
		for (var i = 0; i < list.length; i++) {
			var value = "'" + list[i] + "'";
			expM.addInGroup(field, value);
		}
	};
	$scope.delayLoadOption = function (type) {
		if (type == "ProfitCenter" && $scope.ProfitCenters == undefined) {
			$scope.ProfitCenters = $scope.theOptionLists.ProfitCenterList;
			log($scope.ProfitCenters.length);
		} else if (type == "EndCustomer" && $scope.EndCustomers == undefined) {
			$scope.EndCustomers = $scope.theOptionLists.EndCustomerList;
		}
	};
	$scope.previousTab = function () {
		if ($scope.selectedTabIndex > 0) {
			$scope.selectedTabIndex = $scope.selectedTabIndex - 1;
		}
	};
	$scope.nextTab = function () {
		if ($scope.selectedTabIndex < 7) {
			$scope.selectedTabIndex = $scope.selectedTabIndex + 1;
		}
	};
	var nLoad = 99;
	function isLoaded() {
		nLoad--;
		if (nLoad == 0) {
			$scope.waiting = false;
			//rootScope.$apply();
		}
	};
	function OptionLists() {
		this.BGStr = "BG";
		this.SalesPStr = "SalesP";
		this.OfficeStr = "Office";
		this.SalesOfficeStr = "[Sales Office]";
		this.SalesTypeStr = "[Sales Type]";
		this.ProfitCenterStr = "ProfitCenter";
		this.EndCustomerStr = "[End Customer]";
		this.SoldToCustomerStr = "CustName";

		this.FieldList = [this.BGStr, this.SalesPStr, this.OfficeStr, this.SalesOfficeStr, this.SalesTypeStr, this.ProfitCenterStr, this.EndCustomerStr, this.SoldToCustomerStr];

		this.BGList = null;
		this.SalesPList = null;
		this.OfficeList = null;
		this.SalesOfficeList = null;
		this.SalesTypeList = null;
		this.ProfitCenterList = null;
		this.EndCustomerList = null;
		this.SoldToCustomerList = null;

		this.getStr = function (type) {
			if (type == "BG") {
				return this.BGStr;
			} else if (type == "SalesP") {
				return this.SalesPStr;
			} else if (type == "Office") {
				return this.OfficeStr;
			} else if (type == "SalesOffice") {
				return this.SalesOfficeStr;
			} else if (type == "SalesType") {
				return this.SalesTypeStr;
			} else if (type == "ProfitCenter") {
				return this.ProfitCenterStr;
			} else if (type == "EndCustomer") {
				return this.EndCustomerStr;
			} else if (type == "SoldToCustomer") {
				return this.SoldToCustomerStr;
			} else {
				return type;
			}
		};
		this.getList = function (type) {
			type = this.getStr(type);
			if (type == this.BGStr) {
				return this.BGList;
			} else if (type == this.SalesPStr) {
				return this.SalesPList;
			} else if (type == this.OfficeStr) {
				return this.OfficeList;
			} else if (type == this.SalesOfficeStr) {
				return this.SalesOfficeList;
			} else if (type == this.SalesTypeStr) {
				return this.SalesTypeList;
			} else if (type == this.ProfitCenterStr) {
				return this.ProfitCenterList;
			} else if (type == this.EndCustomerStr) {
				return this.EndCustomerList;
			} else if (type == this.SoldToCustomerStr) {
				return this.SoldToCustomerList;
			} else {
				return null;
			}
		};
		this.setList = function (type, list) {
			type = this.getStr(type);
			if (type == this.BGStr) {
				this.BGList = list;
				$scope.BGs = list;
			} else if (type == this.SalesPStr) {
				this.SalesPList = list;
				$scope.SalesPs = list;
			} else if (type == this.OfficeStr) {
				this.OfficeList = list;
				$scope.Offices = list;
			} else if (type == this.SalesOfficeStr) {
				this.SalesOfficeList = list;
				$scope.SalesOffices = list;
			} else if (type == this.SalesTypeStr) {
				this.SalesTypeList = list;
				$scope.SalesTypes = list;
			} else if (type == this.ProfitCenterStr) {
				this.ProfitCenterList = list;
			} else if (type == this.EndCustomerStr) {
				this.EndCustomerList = list;
			} else if (type == this.SoldToCustomerStr) {
				this.SoldToCustomerList = list;
			}
		};
		this.getFilter = function (type) {
			type = this.getStr(type);
			if (type == this.ProfitCenterStr) {
				return "BG eq '" + theBG + "'";
			} else if (type == this.EndCustomerStr) {
				return "BG eq '" + theBG + "'";
			} else if (type == this.SoldToCustomerStr) {
				return "BG eq '" + theBG + "'";
			} else {
				return "";
			}
		};
	};

	function load1Option(type) {
		var filter = $scope.theOptionLists.getFilter(type);
		if (filter != "") {
			filter = "?$filter=" + filter;
		}
		var urlStr = serviceUrl + "vDim" + type + "4SalesProfile" + filter;
		log(urlStr);
		$http({
			method: "GET",
			url: urlStr,
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			}
		}).then(function mySucces(response) {
			$scope.theOptionLists.setList(type, response.data.d);
			log(type + response.data.d.length);
			isLoaded();
		}, function myError(response) {
			$scope.status = response.status;
			isLoaded();
		});
	};
	function loadOption() {
		$scope.waiting = true;
		nLoad = 7;
		load1Option("BG");
		load1Option("SalesP");
		load1Option("Office");
		load1Option("SalesOffice");
		load1Option("SalesType");
		load1Option("ProfitCenter");
		load1Option("EndCustomer");
		//load1Option("SoldToCustomer");
	};

	$scope.openMenu = function ($mdOpenMenu, $event) {
		$mdOpenMenu($event);
	};

	$scope.edit = function (exp) {
		var rootScope = $scope.$root;
		currentExp = exp;
		$scope.singleField = exp.Field;
		$scope.singleValue = exp.Value.replace(/'/g, "");
		dialogStatus = "edit";
		showPanel();
	};
	function showPanel() {
		$("#setFieldValueContainer").show();
		$scope.inputCommon = "";
		searchCommon();
	};
	$scope.addInGroup = function (group) {
		var rootScope = $scope.$root;
		currentGroup = group;
		dialogStatus = "addInGroup";
		//$scope.showDialog($mdPanel);
		showPanel();
	};
	$scope.addGroup = function (group) {
		var rootScope = $scope.$root;
		currentGroup = group;
		dialogStatus = "addGroup";
		//$scope.showDialog($mdPanel);
		showPanel();
	};
	$scope.changeGroupLogic = function (exp) {
		exp.changeGroupLogic();
	};
};

/*function PanelDialogCtrl(mdPanelRef, $scope) {
$scope.$root.mdPanelRef = mdPanelRef;
};*/
