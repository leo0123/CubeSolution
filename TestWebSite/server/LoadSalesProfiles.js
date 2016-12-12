var dataService = "http://amdpfweb02:8080/SAPBW3DataService.svc/";
var dataUrl = dataService + "vSalesAccount4LoadProfile?$orderby=YEAR_MONTH%20desc";
var dataUrl2 = dataService + "VSalesPersonAccount4LoadProfile";
var dataUrl3 = dataService + "VEmployee_Account4LoadProfile";
var listServer = dataServer + "http://amdpfwfe02:9999/";
var digestUrl = listServer + "_api/contextinfo";
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
        url: listUrl + "?$top=200",
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
    l = 0;
    for (var i = 0; i < total; i++) {
        getAccount(listItems[i]);
    }
};

function getAccount(item) {
    var url = dataUrl3 + "?$filter=Emp_Code eq '" + item.Employee_x0020_Code + "'";
    $.getJSON(url, function (data, status) {
        var len = data.d.length;
        if (len > 0) {
            var OldEmail = "";
            var OldSAPID = "";
            var OtherAccount = "";
            var NTAccount = item.Title.substring(13).toLowerCase();
            var SalesP = item.SalesP.toLowerCase();
            var Email = null;
            if (item.Email != null) {
                Email = item.Email.toLowerCase();
            }
            var Name = item.Name.toLowerCase();
            for (var i = 0; i < len; i++) {
                var oneAccount = data.d[i].Account.toLowerCase();
                if (oneAccount.includes("@")) {
                    if (oneAccount != Email) {
                        OldEmail += oneAccount + ";";
                    }
                } else if (!isNaN(parseInt(oneAccount))) {
                    if (oneAccount != item.Employee_x0020_ID) {
                        OldSAPID += oneAccount + ";";
                    }
                } else {
                    if (oneAccount != Name && oneAccount != SalesP && oneAccount != NTAccount) {
                        OtherAccount += oneAccount + ";";
                    }
                }
            }
            var metadata = {
                __metadata: { type: metaDataType }
                , Old_x0020_Email: OldEmail
                , Old_x0020_SAP_x0020_ID: OldSAPID
                , Other_x0020_Account: OtherAccount
            };
            update(item.ID, metadata);
        } else { l++; }
    });
};

function updateProfile(listItems) {
    alert(listItems.length);
    total = listItems.length;
    m = 0;
    n = 0;
    l = 0;
    for (var i = 0; i < total; i++) {
        var oneItem = listItems[i];
        getEmpCode(oneItem.Title, oneItem.ID);
    }
};

function getEmpCode(ntaccount, id) {
    var account = ntaccount.substring(13);
    var url = dataUrl2 + "?$filter=ntaccount eq '" + account + "'";
    $.getJSON(url, function (data, status) {
        if (data.d.length >= 1) {
            var metadata = {
                __metadata: { type: metaDataType }
		        	, Name: data.d[0].Name
		        	, Employee_x0020_ID: data.d[0].Race
		        	, Employee_x0020_Code: data.d[0].Emp_Code
		        	, SalesP: data.d[0].SalesP
		        	, Terminate_x0020_Date: data.d[0].Terminate_Date
		        	, Status: data.d[0].Status
            };
            update(id, metadata);
        } else {
            l++;
            alert("account:" + account + data.d.length);
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
    total = AccountList.length;
    for (var i = 0; i < total; i++) {//AccountList.length
        var oneSales = AccountList[i];
        create(oneSales.SALES_ACCOUNT);
    }
};

var total = 0;
var m = 0;
var n = 0;
var l = 0;
function create(title) {
    var metadata = { __metadata: { type: 'SP.Data.Sales_x0020_Person_x0020_ProfileListItem' }, Title: 'i:0#.w|delta\\' + title, Name: title };
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
    if (total > 0 && m + n + l == total) {
        alert("success: " + m + "; error: " + n + "; miss: " + l);
    }
};
