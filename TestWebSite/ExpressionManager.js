function ExpressionManager() {

    var expR = new Expression();
    expR.setGroup();
    this.setRoot = function (e) {
        expR = e;
    };
    this.getRoot = function () {
        return expR;
    };
    this.add = function (group, field, value) {
        var newExp = new Expression();
        newExp.setFieldValue(field, value);
        group.addChild(newExp);
        return newExp;
    };
    this.addGroup = function (leftGroup, field, value) {
        var newExp = new Expression();
        newExp.setFieldValue(field, value);
        if (leftGroup.getParent() == null) {
            var parent = new Expression();
            parent.setGroup();
            var rightGroup = new Expression();
            rightGroup.setGroup();
            rightGroup.addChild(newExp);
            parent.addChild(leftGroup);
            parent.addChild(rightGroup);
            expR = parent;
        } else {
            var parent = leftGroup.getParent();
            var rightGroup = new Expression();
            rightGroup.setGroup();
            rightGroup.addChild(newExp);
            //parent.addChild(rightGroup);//should be change to insertAfter(index)
            parent.insertChild(leftGroup, rightGroup);
            expR = parent;
        }
        return newExp;
    };
};