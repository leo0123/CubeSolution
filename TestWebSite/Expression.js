function Expression() {
    this.IsGroup = true;
    var Parent = null;

    //FIELD VALUE
    this.Field = "";
    this.Value = "";
    //FIELD VALUE

    //GROUP
    this.GroupLink = " or ";
    this.Children = [];
    //GROUP
};

Expression.prototype.getParent = function () {
    return Parent;
};
Expression.prototype.setParent = function (e) {
    Parent = e;
};

//GROUP
Expression.prototype.setGroup = function () {
    this.GroupLink = " or ";
    this.IsGroup = true;
    this.Field = null;
    this.Value = null;
};
Expression.prototype.addChild = function (exp) {
    this.Children.push(exp);
    exp.setParent(this);
};
Expression.prototype.insertChild = function (leftExp, rightExp) {
    var i = this.Children.indexOf(leftExp);
    this.Children.splice(i + 1, 0, rightExp);
    rightExp.setParent(this);
};
Expression.prototype.changeGroupLink = function () {
    if (this.getParent().GroupLink == " and ") {
        this.getParent().GroupLink = " or ";
    } else {
        this.getParent().GroupLink = " and ";
    }
};
Expression.prototype.getGroupLink = function () {
    if (this.getParent().Children.indexOf(this) == 0) {
        return "";
    }
    else {
        return this.getParent().GroupLink;
    }
};
Expression.prototype.getChildren = function () {
    return this.Children;
};
Expression.prototype.removeChild = function (exp) {
    var i = this.Children.indexOf(exp);
    this.Children.splice(i, 1);
};
//GROUP

//FIELD VALUE
Expression.prototype.setFieldValue = function (field, value) {
    this.Field = field;
    this.Value = value;
    this.IsGroup = false;
    this.GroupLink = "";
    this.Children = null;
};
Expression.prototype.removeSelf = function () {
    this.getParent().removeChild(this);
};
//FIELD VALUE

Expression.prototype.ToString = function () {
    if (!this.IsGroup) {
        return this.Field + "=" + this.Value;
    }
    else {
        var value = "";
        for (var i = 0; i < this.Children.length; i++) {
            var child = this.Children[i];
            if (value == "") {
                value = child.ToString();
            }
            else {
                value += this.GroupLink + child.ToString();
            }
        }
        return "(" + value + ")";
    }
};

Expression.prototype.CopyFrom = function (e) {
    this.IsGroup = e.IsGroup;
    
};