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

//////////////////////////////////
function SkuDataParse(skuData) {
    this.maps = this.openWay = null;
    this.categoriesMap = this.attributesMap = this.categoriesChildMap = null;
    this.skuMap = null;
    this.pathFinder = null;
    this.originSkuData = null;

    this.primeSkuMap = null;
    this.primeArray = null;
    this.attributesCount = this.categoriesCount = this.primeArrayIndex = 0;
    this.transformIdMap = this.inverseIdMap = null;
    this.primeNumbersMap = {
        "4": 10,
        "17": 60,
        "29": 110,
        "37": 160,
        "46": 210,
        "55": 260,
        "63": 310,
        "72": 360,
        "80": 410,
        "88": 460,
        "97": 510,
        "102": 560,
        "111": 610,
        "120": 660,
        "127": 710,
        "134": 760,
        "140": 810,
        "149": 860,
        "155": 910,
        "162": 960,
        "169": 1010,
        "177": 1060,
        "186": 1110,
        "191": 1160,
        "197": 1210,
        "205": 1260
    };
    this.init(skuData);
}

SkuDataParse.prototype.init = function (skuData) {
    var maps;
    try {
        // clone origin data
        this.originSkuData = this._clone(skuData);

        this.categoriesMap = this.getCategories(this.originSkuData.skuName);

        maps = this.getMaps(this.originSkuData.skuList);

        this.categoriesChildMap = maps.categoriesMap;
        this.attributesMap = maps.attributesMap;
        this.skuMap = maps.skuMap;

        this.transformIdMap = this.primeTransformer(this.categoriesChildMap);
        this.inverseIdMap = this.inverseHashMap(this.transformIdMap);

        this.maps = this.getWay(this.categoriesChildMap);

        maps = this.getOpenWay(this.skuMap);
        this.openWay = maps.openWay;
        this.primeSkuMap = maps.primeSkuMap;

        this.actualMaps = this.transformMaps(this.maps);

        this.pathFinder = new PathFinder(this.maps, this._clone(this.openWay), false);
    } catch (e) {
        throw e;
    }
};

SkuDataParse.prototype.transformMaps = function (maps) {
    return maps.map(function (map) {
        return map.map(function (v) {
            return this.getActualAttributesId(v);
        }, this)
    }, this);
};

/**
 * @param map
 * @returns {Array}
 */

SkuDataParse.prototype.getWay = function (map) {
    var way = [], prop;
    for (prop in map) {
        if (!map.hasOwnProperty(prop)) continue;
        way.push(map[prop].map(function (v) {
            return parseInt(this.transformIdMap[v])
        }, this));
    }
    return way;
};


SkuDataParse.prototype.inverseHashMap = function (hashMap) {
    var hash = {}, prop;
    for (prop in hashMap) {
        if (!hashMap.hasOwnProperty(prop)) continue;
        hash[hashMap[prop]] = prop;
    }
    return hash;
};

SkuDataParse.prototype.getOpenWay = function (map) {
    var openWay = [], prop, s = /[:;]/;
    var primeSkuMap = {}, multiply;

    for (prop in map) {
        if (!map.hasOwnProperty(prop)) continue;
        multiply = 1;
        openWay.push(prop.split(s).filter(function (v, i) {
            // cate:attr;cate:attr;cate:attr...
            return i % 2;
        }).map(function (v) {
            v = parseInt(this.transformIdMap[v]);
            multiply *= v;
            return v;
        }, this));

        primeSkuMap[multiply] = map[prop];
    }
    return {
        openWay: openWay,
        primeSkuMap: primeSkuMap
    };
};

/**
 * @param list
 * @returns {{attributesMap: ({}|*), categoriesMap: ({}|*), skuMap: ({}|*)}}
 */

SkuDataParse.prototype.getMaps = function (list) {
    var i, n, attrMap, skuMap, cateMap, names, ids, cur;
    var ns = /\s+/, is = /[:;]/;
    var cateId, attrId, curCate;

    attrMap = {};
    cateMap = {};
    skuMap = {};

    for (i = 0; (cur = list[i++]);) {
        names = cur.names.split(ns);
        ids = cur.pvs.split(is);

        if (2 * names.length !== ids.length)
            throw new Error('error: Data error');

        for (n = 0; n < names.length; n++) {
            // attributesMap
            // 0-1, 1-3, 2-5, 3-7..
            cateId = ids[2 * n];
            attrId = ids[2 * n + 1];

            // categories -> attributes
            if (!attrMap[attrId]) {
                this.attributesCount++;
                attrMap[attrId] = names[n];
            }

            if (!cateMap[cateId]) {
                this.categoriesCount++;
                cateMap[cateId] = [];
            }

            curCate = cateMap[cateId];

            if (curCate.indexOf(attrId) === -1) {
                curCate.push(attrId)
            }
        }

        // skuMap
        skuMap[cur.pvs] = cur;
    }

    return {
        attributesMap: attrMap,
        categoriesMap: cateMap,
        skuMap: skuMap
    }
};

/**
 * generate categories map
 * @param categories
 * @returns {{}|*}
 */

SkuDataParse.prototype.getCategories = function (categories) {
    var map, names, ids, i;
    try {
        names = categories.names.split(' ');
        ids = categories.pvs.split(';');
    } catch (e) {
        throw new Error('error: skuNames data format');
    }

    if (names.length !== ids.length) {
        throw new Error('names.length !== ids.length')
    }

    map = {};

    for (i = 0; i < names.length; i++) {
        map[ids[i]] = names[i]
    }
    return map;
};

/**
 * Generate an array that consist of prime number
 * @param num
 * @returns {Array}
 */

SkuDataParse.prototype._getPrime = function (num) {
    var i, k, arr = [];

    for (i = 2; i < num; i++)
        arr.push(i);
    for (i = 0; i < arr.length; i++) {
        for (k = i + 1; k < arr.length; k++) {
            if (arr[k] % arr[i] === 0)
                arr.splice(k, 1);
        }
    }
    return arr;
};

/**
 * prime transformer
 * @param categoriesChildMap
 * @returns {{}}
 */

SkuDataParse.prototype.primeTransformer = function (categoriesChildMap) {
    var map = {}, total = this.attributesCount + this.categoriesCount;
    var num = null, prop, primeKeys, cur;

    primeKeys = Object.keys(this.primeNumbersMap).map(function (v) {
        return parseInt(v);
    });

    // 这里的数据很少,直接查吧,不用二分了.
    primeKeys.some(function (v) {
        return (num = v) >= total;
    });

    this.primeArray = this._getPrime(this.primeNumbersMap[num]);

    for (prop in categoriesChildMap) {
        if (categoriesChildMap.hasOwnProperty(prop)) {
            cur = categoriesChildMap[prop];
            map[prop] = this.primeArray[this.primeArrayIndex++];

            cur.forEach(function (v, i, a) {
                map[v] = this.primeArray[this.primeArrayIndex++]
            }, this);
        }
    }

    return map;
};

/**
 * clone object
 * @param object
 * @returns {*}
 * @private
 */

SkuDataParse.prototype._clone = function (object) {
    var result = null;
    try {
        result = JSON.parse(JSON.stringify(object));
    } catch (e) {

    }
    return result;
};

/**
 *  Wrapper method of PathFiner
 * @param val
 */

SkuDataParse.prototype.add = function (val) {
    this.pathFinder.add(this.transformIdMap[val]);
};

/**
 * Wrapper method of PathFiner
 * @param val
 */

SkuDataParse.prototype.remove = function (val) {
    this.pathFinder.remove(this.transformIdMap[val]);
};

SkuDataParse.prototype.getActualAttributesName = function (id) {
    return this.attributesMap[this.inverseIdMap[id]];
};

SkuDataParse.prototype.getActualAttributesId = function (id) {
    return this.inverseIdMap[id];
};

SkuDataParse.prototype.getSkuData = function () {
    var multiply = 1;
    this.pathFinder.selected.forEach(function (v) {
        multiply *= v;
    });
    return this.primeSkuMap[multiply] || null;
};
//////////////////////////////////

function SkuRender(config) {
    this.wrapper = this.wayWrapper = this.originData = this.parse = null;
    this.configs = config;
}

SkuRender.prototype.init = function (config) {
    config = config || this.configs;
    this.wrapper = config.wrapper;
    this.originData = config.originData;
    this.wayWrapper = config.wayWrapper;
    this.selectCallback = config.selectCallback || function () {
        };

    this.parse = new SkuDataParse(config.originData);
    this.rendUi();
    config.wayWrapper && this.rendWay(this.parse.openWay);
    this.bind();
};

SkuRender.prototype.rendUi = function () {
    this.wrapper.innerHTML = this.template(this.parse.actualMaps, this.parse.pathFinder.light);
};

SkuRender.prototype.template = function (maps, light) {
    var html = [], name, id, parse = this.parse;
    var m = {
        0: 'btn btn-warning disabled',
        1: 'btn btn-default',
        2: 'btn active btn-warning'
    };

    maps.forEach(function (map, i) {
        html.push('<div class="group">');

        // 分类名
        html.push('<span class="text">' + this.getCategoriesNameWithChildId(map[0]) + '</span>');
        // 属性名
        map.forEach(function (v, j) {
            html.push('<button data-id="' + v + '" class="' + m[light[i][j]] + '">' + parse.attributesMap[v] + '</button>');
        });
        html.push('</div>');
    }, this);

    return html.join('\n');
};

SkuRender.prototype.bind = function () {
    this.wrapper.addEventListener('click', function (e) {
        var t = e.target,
            c = t.className,
            v = t.dataset['id'];

        if (c.indexOf('btn') > -1) {
            // active status
            this.parse[c.indexOf('active') > -1 ? 'remove' : 'add'](v);
            this.rendUi();
            this.selectCallback(this.parse.getSkuData());
        }
    }.bind(this), true);
};

SkuRender.prototype.rendWay = function (ways) {
    var html = [];
    ways.forEach(function (way) {
        way = way.map(function (v) {
            return this.parse.getActualAttributesName(v)
        }, this);

        html.push('<div class="way ui-inline-block" id="' + way.join(':') + '">');
        html.push(way.join('-'));
        html.push('</div>');
    }, this);

    this.wayWrapper.innerHTML = html.join('\n');
};

SkuRender.prototype.attributesCate = function (id) {
    var cateId = -1, prop, childMap = this.parse.categoriesChildMap;
    for (prop in childMap) {
        if (childMap.hasOwnProperty(prop)) {
            if (childMap[prop].indexOf(id) !== -1) {
                cateId = prop;
                break;
            }
        }
    }
    return cateId;
};

SkuRender.prototype.getCategoriesNameWithChildId = function (id) {
    return this.parse.categoriesMap[this.attributesCate(id)];
};