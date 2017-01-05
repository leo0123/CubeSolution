var opEqual = "=";
var opLike = "like";
var opIn = "in";
var opList = [opEqual, opIn];

var comma = ",";
var fList = ["bg", "salesp", "[end customer]", "[sales office]", "profitcenter", "[sales type]"]; //should be lower case

var lgAnd = "and";
var lgOr = "or";
var lgList = [lgAnd, lgOr];

var pField = /\b[a-z]*\b/;
var pField1 = /\[?\b[a-z]*\b\s*\b[a-z]*\b\]?/;
var pValue = /'\b[a-z0-9]*\b'/;
var pLeft = "(";
var pRight = ")";

var pList = [lgAnd, lgOr, /\(/, /\)/, opEqual, opIn, comma, pField, pValue]; //pField get too much, last
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
			if (stack[stack.length - 1] == pRight) {
				BuildExpression();
			}
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
	log(lastExp.ToString());
	return lastExp;
};

var lastExp;
var status;
function BuildExpression() {
	if (stack.length == 0) {
		return;
	}
	var item = stack.pop();
	if (isValue(item)) {
		getOneFieldValueOrInGroup(item);
		if (status == "oneFieldValue") {
			BuildExpression();
		}
	} else if (isLg(item)) {
		getOneGroup(item);
		BuildExpression();
	} else if (item == pRight) {
		BuildExpression();
	} else if (item == pLeft) {
		stack.push(lastExp);
		lastExp = null;
	} else if (item instanceof Expression) {
		lastExp = item;
		BuildExpression();
	}
};

function getOneGroup(item) {
	var exp = new Expression();
	exp.GroupLogic = " " + item + " ";
	exp.Children.push(lastExp);
	do {
		item = stack.pop();
		if (isValue(item)) {
			getOneFieldValueOrInGroup(item);
			if (status == "oneFieldValue") {
				exp.Children.push(lastExp);
			}
		} else if (item instanceof Expression) {
			exp.Children.push(item);
		} else {
			throw "unexpected";
		}
		if (stack.length == 0) {
			break;
		}
		item = stack.pop();
	} while (isLg(item))
	stack.push(item);
	lastExp = exp;
	log(lastExp.ToString());
};

function getOneFieldValueOrInGroup(item) {
	var exp = new Expression();
	exp.IsGroup = false;
	exp.Value = item;
	item = stack.pop();
	if (isOp(item)) {
		exp.Operation = item;
		item = stack.pop();
		if (isField(item)) {
			exp.Field = item;
			lastExp = exp;
			status = "oneFieldValue";
		}
	} else if (item == comma || item == pLeft) {
		exp.Operation = opEqual;
		var g = new Expression();
		g.IsGroup = true;
		g.Children.push(exp);
		do {
			item = stack.pop();
			if (isValue(item)) {
				exp = new Expression();
				exp.IsGroup = false;
				exp.Value = item;
				exp.Operation = opEqual;
				g.Children.push(exp);
			} else if (item == comma) {
				//nothing to do
			} else if (item == pLeft) {
				item = stack.pop();
				if (item == opIn) {
					//nothing to do
					item = stack.pop();
					if (isField(item)) {
						for (var i = 0; i < g.Children.length; i++) {
							exp = g.Children[i];
							exp.Field = item;
						}
						//lastExp = g;
						stack.push(g);
						status = "inGroup";
						break;
					}
				}
			} else if (item == opIn) {
				//nothing to do
				item = stack.pop();
				if (isField(item)) {
					for (var i = 0; i < g.Children.length; i++) {
						exp = g.Children[i];
						exp.Field = item;
					}
					//lastExp = g;
					stack.push(g);
					status = "inGroup";
					break;
				}
			} else {
				break;
			}
		} while (stack.length > 0)
	} else {
		throw "unexpected";
	}
};

function isLg(e) {
	if (lgList.indexOf(e) >= 0) {
		return true;
	} else {
		return false;
	}
};

function isField(e) {
	if (fList.indexOf(e) >= 0) {
		return true;
	} else {
		return false;
	}
};

function isOp(e) {
	if (opList.indexOf(e) >= 0) {
		return true;
	} else {
		return false;
	}
};

function isValue(e) {
	if (typeof e == "string" && e.indexOf("'") == 0) {
		return true;
	} else {
		return false;
	}
};

function ParseAnyOne(p) {
	var i = sql.search(/\[/);
	if (i == 0) {
		p = pField1;
	}
	i = sql.search(p);
	if (i != 0) {
		return false;
	}
	var values = sql.match(p);
	//log(values[0]);
	stack.push(values[0]);
	sql = sql.substring(values[0].length);
	sql = trimStart(" ", sql);
	log(stack);
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

/*ParseSql("(BG = 'IABG' AND [Sales Office] = 'DPC' AND [Sales Type] = 'TRADING')");
if (lastExp != null) {
	log(lastExp);
	log(lastExp.ToString());
}*/
