var listServer="http://amdpfwfe02:9999/";
var SPUserProfileUrl=listServer+"_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v=";//'delta\username'
var dataService = "http://amdpfweb02:8080/SAPBW3DataService.svc/";
var dataUrlHr = dataService + "VSalesPersonAccount4LoadProfile/";
var listUrl = listServer + "_api/web/lists/getbytitle('Sales Person Profile')/items";

var spDomainAccount;
var spEmployeeID;
var spEmployeeCode;
var spSalesP;
var spStatus;
var spTerminateDate;
var spName;
var spDepartment;
var spCompany;
var spEmail;
var spOffice;
var spPermission;

var readyToSave=0;

$(document).ready(function(){
    $("[value='Save']").hide();
    $("[value='Cancel']").hide();
    $("[title='spHide']").hide();
    
    spDomainAccount=$("[title='Domain Account Required Field']");
    spEmployeeID=$("[title='Employee ID']");
    spEmployeeCode=$("[title='Employee Code']");
    spSalesP=$("[title='SalesP']");
    spStatus=$("[title='Status']");
    spTerminateDate=$("[title='Terminate Date']");
    spName=$("[title='Name Required Field']");
    spDepartment=$("[title='Department']");
    spCompany=$("[title='Company']");
    spEmail=$("[title='Email']");
    spOffice=$("[title='Office']");
    spPermission=$("[title='Permission']");
    spJSONStr=$("[title='JSONStr']");
    //alert(spJSONStr.val());
    
    spDomainAccount.attr("readonly","readonly");
    spEmployeeID.attr("readonly","readonly");
    spEmployeeCode.attr("readonly","readonly");
    spSalesP.attr("readonly","readonly");
    spStatus.attr("readonly","readonly");
    spTerminateDate.attr("readonly","readonly");
    spName.attr("readonly","readonly");
    spDepartment.attr("readonly","readonly");
    spCompany.attr("readonly","readonly");
    spEmail.attr("readonly","readonly");
    spOffice.attr("readonly","readonly");
    spPermission.attr("readonly","readonly");
    
    $("#permissionEditorContainer").load('../../SitePages/permission.html',function(){
//        $("#HiddenAngular").hide();
//        $("#AngularCancel").click(function(){
//            $("#AngularDiv").css('zIndex',-1);
//        });
//        $("#AngularOK").click(function(){
//            $("[title='Permission']").val($("#AngularPermission").text());
//            $("#HiddenData [title='JSONStr']").val($("#AngularJSONStr").text());
//
//            $("#AngularDiv").css('zIndex',-1);
//        });
	});

    

    $("#btSave").click(function(){
        $("#msg").text("");
        var SPUserName=getSPUserName();
        if(SPUserName!=undefined && (readyToSave<2 || SPUserName!=spDomainAccount.val())){
            $("#msg").text("Data not ready to save");
            return;
        }
        $("[value='Save']").click();
    });
    $("#btCancel").click(function () {
        $("[value='Cancel']").click();
    });
    
    $("#btLoad").click(function(){
        $("#msg").text("");
        spDomainAccount.val(getSPUserName());
        var url=listUrl+"?$filter=Title eq '"+spDomainAccount.val()+"'";
        $.ajax({
          url: url,
          type: "GET",
          headers: { "accept": "application/json;odata=verbose" },
          success: function(data){
              if(data.d.results.length>0){
                  $("#msg").text(spDomainAccount.val() + " already has profile");
              }else{
                    url=SPUserProfileUrl+"'delta\\"+spDomainAccount.val()+"'";
                    $.ajax({
                      url: url,
                      type: "GET",
                      headers: { "accept": "application/json;odata=verbose" },
                      success: successHandler,
                      error: errorHandler
                    });
                    url = dataUrlHr+"?$filter=ntaccount eq '"+spDomainAccount.val()+"'";
                    $.getJSON(url, function(data){
                        var Race=data.d[0].Race;
                        var Emp_Code=data.d[0].Emp_Code;
                        var SalesP=data.d[0].SalesP;
                        var Status=data.d[0].Status;
                        var Terminate_Date=data.d[0].Terminate_Date;
                        if (Terminate_Date != null){
                            Terminate_Date = new Date(parseInt(Terminate_Date.substr(6)));
                        }

                        spEmployeeID.val(Race);
                        spEmployeeCode.val(Emp_Code);
                        spSalesP.val(SalesP);
                        spStatus.val(Status);
                        spTerminateDate.val(Terminate_Date);
                        readyToSave++;
                    });
              }
          },
          error: errorHandler
        });
        
    });
});

function getSPUserName(){
    var SPUserName=$("[id='divEntityData']").attr("key");
    if(SPUserName==undefined){
        return SPUserName;
    }
    SPUserName=SPUserName.substr(SPUserName.indexOf("\\")+1);
    //SPUserName="Tim.Jordan";
    return SPUserName;
};

function successHandler(data){
    var Name=data.d.DisplayName;
    var Email=data.d.Email;
    var Department=data.d.UserProfileProperties.results.find(getDept).Value;
    var Company=data.d.UserProfileProperties.results.find(getCom).Value;
    var Office=data.d.UserProfileProperties.results.find(getOffice).Value;
    
    spName.val(Name);
    spDepartment.val(Department);
    spCompany.val(Company);
    spEmail.val(Email);
    spOffice.val(Office);
    readyToSave++;
};
function errorHandler(data){
    
};
function getDept(prop) {
    return prop.Key == "Department";
};
function getCom(prop) {
    return prop.Key == "Company";
};
function getOffice(prop) {
    return prop.Key == "Office";
};