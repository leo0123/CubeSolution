var dataUrl = "http://amdpfweb02:8080/SAPBW3DataService.svc/vSalesAccount?$orderby=YEAR_MONTH%20desc";
var dataUrl2 = "http://amdpfweb02:8080/SAPBW3DataService.svc/VSalesPersonAccount";
var dataUrl3 = "http://amdpfweb02:8080/SAPBW3DataService.svc/VEmployee_Account";
var listServer = "http://amdpfwfe02:9999/";
var listUrl = listServer + "_api/web/lists/getbytitle('Sales Person Profile')/items";
var digest = null;
var metaDataType = "SP.Data.Sales_x0020_Person_x0020_ProfileListItem";

function importData(e) {
    if (e == "YCMRSales") {
        start(getNTAccount);
    } else if (e == "updateProfile") {
        start(getProfile)
    }
};

function start(call) {
    getFormDigestService(call);
};

function getFormDigestService(call) {
    var digestUrl = "http://amdpfwfe02:9999/_api/contextinfo";
    $.ajax({
        url: digestUrl,
        type: 'post',
        data: '',
        headers: {
            'Accept': 'application/json;odata=verbose'
        },
        success: function (data) {
            digest = data.d.GetContextWebInformation.FormDigestValue;
            alert(digest);
            call();
        }
    });
};

function getProfile() {
    $.ajax({
        url: listUrl,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            updateProfile(data.d.results);
            //updateProfileP2(data.d.results);
        },
        error: function (data) {
            alert("Error: " + data);
        }
    });
};

function updateProfileP2(listItems) {
    alert(listItems.length);
    total = listItems.length;
    m = 0;
    n = 0;
    for (var i = 0; i < total; i++) {
        var oneItem = listItems[i];
        getAccount(oneItem.Employee_x0020_Code, oneItem.ID);
    }
};

function getAccount(item) {
    //TODO
    var url = dataUrl3 + "?$filter=Emp_Code eq '" + item.Employee_x0020_Code + "'";
    $.getJSON(url, function (data, status) {
        var l = data.d.length;
        if (l > 0) {
            var metadata = {
                __metadata: { type: metaDataType }
                , Email: ""

            };
            for (var i = 0; i < l; i++) {
                var oneAccount = data.d[i];
                if (oneAccount.AccountType == "Email" && oneAccount.Account.endswith("@deltaww.com")) {

                }
            }
            update(item.ID, metadata);
        }
    });
};

function updateProfile(listItems) {
    alert(listItems.length);
    total = listItems.length;
    m = 0;
    n = 0;
    for (var i = 0; i < total; i++) {
        var oneItem = listItems[i];
        getEmpCode(oneItem.Title, oneItem.ID);
    }
};

function getEmpCode(ntaccount, id) {
    var account = ntaccount.substring(13);
    var url = dataUrl2 + "?$filter=ntaccount eq '" + account + "'";
    $.getJSON(url, function (data, status) {
        if (data.d.length == 1) {
            var metadata = {
                __metadata: { type: metaDataType }
		        	, Name: data.d[0].Name
		        	, SAP_x0020_Employee_x0020_ID: data.d[0].Race
		        	, Employee_x0020_Code: data.d[0].Emp_Code
		        	, SalesP: data.d[0].SalesP
            };
            update(id, metadata);
        }
    });
};

function update(id, metadata) {
    $.ajax({
        url: listUrl + "(" + id + ")",
        type: 'post',
        data: JSON.stringify(metadata),
        headers: {
            "X-HTTP-Method": "MERGE",
            "IF-MATCH": "*",
            "accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
            "content-length": metadata.length,
            "X-RequestDigest": digest
        },
        dataType: 'json',
        success: function (data) {
            m++;
            isDone();
        },
        error: function (data) {
            n++;
            isDone();
        }
    });
};

function getNTAccount() {
    $.getJSON(dataUrl, function (data, status) {
        uploadNTAccount(data.d);
    });
};

function uploadNTAccount(AccountList) {
    alert(AccountList.length);
    total = 5;
    for (var i = 0; i < total; i++) {//AccountList.length
        var oneSales = AccountList[i];
        create(oneSales.SALES_ACCOUNT);
    }
};

var total = 0;
var m = 0;
var n = 0;
function create(title) {
    var metadata = { __metadata: { type: 'SP.Data.Sales_x0020_Person_x0020_ProfileListItem' }, Title: 'i:0#.w|delta\\' + title, Domain_x0020_Account: title };
    $.ajax({
        url: listUrl,
        type: 'post',
        data: JSON.stringify(metadata),
        headers: {
            "accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
            "content-length": metadata.length,
            "X-RequestDigest": digest
        },
        dataType: 'json',
        success: function (data) {
            m++;
            isDone();
        },
        error: function (data) {
            n++;
            isDone();
        }
    });
};

function isDone() {
    if (total > 0 && m + n == total) {
        alert("success: " + m + "; error: " + n);
    }
};
