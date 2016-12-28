var opEqual = "=";
var opLike = "like";
var opIn = "in";
var opList = [opEqual];

var fList=["bg","customer"];

var lgAnd = "and";
var lgOr = "or";
var lgList=[lgAnd,lgOr];

var pField = /\b[a-z]*\b/;
var pValue = /'\b[a-z]*\b'/;
var pLeft = "(";

var pList = [pField, opEqual, pValue, lgAnd, lgOr];
var sql;
var stack = [];

function log(str) {
	console.log(str);
};

function ParseSql(oSql) {
	sql = oSql.toLowerCase();
	var i = 0;
	while (i < pList.length) {
		var p = pList[i];
		if (ParseAnyOne(p) == true) {
			if (sql.length == 0) {
				break;
			}
			i = 0;
		} else {
			i++;
		}
	}
	log(stack);
	BuildExpression();
};

var lastExp;
function BuildExpression() {
	if (stack.length == 0){
		return;
	}	
	var item = stack.pop();
	if (isValue(item)){
		getOneFieldValue(item);
		BuildExpression();
	} else if (isLg(item)) {
		getOneGroup(item);
		BuildExpression();
	}
};

function getOneGroup(item){
	var exp = new Expression();
	do {
		exp.GroupLogic=" "+item+" ";
		exp.Children.push(lastExp);
		item = stack.pop();
		getOneFieldValue(item);
		exp.Children.push(lastExp);
		if (stack.length == 0){
			break;
		}
		item = stack.pop();			
	} while (isLg(item))
	lastExp = exp;
};

function getOneFieldValue(item){
	var exp = new Expression();
	exp.IsGroup = false;
	exp.Value=item;
	item=stack.pop();
	if (isOp(item)){
		exp.Operation=item;
		item=stack.pop();
		if (isField(item)){
			exp.Field=item;
			lastExp=exp;
		}
	}
};

function isLg(e){
	if (lgList.indexOf(e)>=0){
		return true;
	} else{
		return false;
	}
};

function isField(e){
	if (fList.indexOf(e)>=0){
		return true;
	} else{
		return false;
	}
};

function isOp(e){
	if (opList.indexOf(e)>=0){
		return true;
	} else{
		return false;
	}
};

function isValue(e){
	if (e.indexOf("'")==0){
		return true;
	} else{
		return false;
	}
};

function ParseAnyOne(p) {
	var i = sql.search(p);
	if (i != 0) {
		return false;
	}
	var values = sql.match(p);
	log(values[0]);
	stack.push(values[0]);
	sql = sql.substring(values[0].length);
	sql = trimStart(" ", sql);
	log(sql);
	return true;
};

function trimStart(character, string) {
	var startIndex = 0;
	while (string[startIndex] === character) {
		startIndex++;
	}
	return string.substr(startIndex);
}

ParseSql("bg = 'fmbg' and customer= 'apple'");
