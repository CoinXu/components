function PathFinder(maps, openWay, useReg) {
    this.openWay = openWay;
    this.maps = maps || [];
    this.useReg = useReg;

    this._way = {};
    this.light = [];
    this.selected = [];
    this.count = 0;
    this.init();
}

PathFinder.prototype.init = function () {
    var light, i, l, j;

    light = this.light = this.clone(this.maps);

    for (i = 0; i < light.length; i++) {
        l = light[i];
        for (j = 0; j < l.length; j++) {
            this._way[l[j]] = [i, j];
            l[j] = 1;
        }
    }

    for (i = 0; i < this.openWay.length; i++) {
        this.openWay[i] = this.useReg
            ? this.openWay[i].join(':')
            : eval(this.openWay[i].join('*'))
    }

    this._check();
};

PathFinder.prototype.clone = function (arr) {
    var ret = [], cur, i;
    for (i = 0; i < arr.length; i++) {
        cur = arr[i];
        ret.push(cur.slice ? cur.slice() : cur);
    }
    return ret;
};

PathFinder.prototype._check = function (isAdd) {
    var light = this.light,
        maps = this.maps,
        time = Date.now(),
        i, j, li, selected;

    this.time = time;
    this.count = 0;

    for (i = 0; i < light.length; i++) {
        li = light[i];
        selected = this._getSelected(i);
        for (j = 0; j < li.length; j++) {
            if (li[j] !== 2) {
                if (isAdd) {
                    if (li[j]) {
                        light[i][j] = this._checkItem(maps[i][j], selected);
                        this.count++
                    }
                }
                else {
                    light[i][j] = this._checkItem(maps[i][j], selected);
                    this.count++;
                }
            }
        }
    }

    this.time = Date.now() - time;
    return this.light;
};

PathFinder.prototype._checkItem = function (item, selected) {
    var openWay = this.openWay;
    var val = item * selected, i;

    for (i = 0; i < openWay.length; i++) {
        this.count++;
        if (openWay[i] % val === 0)
            return 1;
    }

    return 0;
};

PathFinder.prototype._getSelected = function (path) {
    var selected = this.selected;
    var _way = this._way;
    var ret = 1, retArr = [], i = 0, s;

    if (selected.length) {
        for (i = 0; i < selected.length; i++) {
            s = selected[i];
            if (_way[s][0] !== path) {
                ret = ret * s;
                retArr.push(s);
            }
        }
    }

    return this.useReg ? retArr : ret;
};

PathFinder.prototype.add = function (point) {
    point = (point instanceof Array) ? point : this._way[point];
    var val = this.maps[point[0]][point[1]];

    if (!this.light[point[0]][point[1]]) {
        throw new Error('this point [' + point +
            '] is no availabe, place choose an other');
    }

    if (val in this.selected) return;

    var isAdd = this._dealChange(point, val);
    this.selected.push(val);
    this.light[point[0]][point[1]] = 2;
    this._check(!isAdd);
};

PathFinder.prototype._dealChange = function (point, val) {
    var selected = this.selected;
    for (var i = 0; i < selected.length; i++) {
        var line = this._way[selected[i]];
        if (line[0] === point[0]) {
            this.light[line[0]][line[1]] = 1;
            selected.splice(i, 1);
            return true;
        }
    }

    return false;
};

PathFinder.prototype.remove = function (point) {

    point = (point instanceof Array) ? point : this._way[point];

    try {
        var val = this.maps[point[0]][point[1]];
    } catch (e) {
    }

    if (val) {
        for (var i = 0; i < this.selected.length; i++) {
            if (this.selected[i] == val) {
                var line = this._way[this.selected[i]];
                this.light[line[0]][line[1]] = 1;
                this.selected.splice(i, 1);
            }
        }

        this._check();
    }
};

PathFinder.prototype.getWay = function () {
    var light = this.light;
    var way = this.clone(light);
    for (var i = 0; i < light.length; i++) {
        var line = light[i];
        for (var j = 0; j < line.length; j++) {
            if (line[j]) way[i][j] = this.maps[i][j];
        }
    }

    return way;
};

