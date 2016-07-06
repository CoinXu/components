function SkuDataParse(skuData) {
    this.maps = this.openWay = null;
    this.categoriesMap = this.attributesMap = this.categoriesChildMap = null;
    this.skuMap = null;
    this.pathFinder = null;
    this.originSkuData = null;
    this.separator_value = '_';
    this.separator_item = '|';

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

        var caMap = this.getCategories(this.originSkuData.skuAttributeList);

        this.categoriesMap = caMap.category;
        this.attributesMap = caMap.attributes;
        this.categoriesChildMap = caMap.children;
        this.skuMap = this.getMaps(this.originSkuData.skuList);

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
    var openWay = [], prop, s = /[|]/;
    var primeSkuMap = {}, multiply, list, way;

    for (prop in map) {
        if (!map.hasOwnProperty(prop)) continue;
        multiply = 1;
        list = prop.split(s);
        way = list.map(function (v) {
            v = parseInt(this.transformIdMap[v]);
            multiply *= v;
            return v;
        }, this);

        openWay.push(way);
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
    var map = {};
    list.forEach(function (item) {
        map[item.skuCompose] = item;
    });

    return map;
};

/**
 * generate categories map
 * @param categories
 * @returns {{}|*}
 */

SkuDataParse.prototype.getCategories = function (categories) {

    var categoryMap = {};
    var attributesMap = {};
    var categoryChildrenMap = {};
    var separator = this.separator_value;
    var id = null;
    var cid = null;
    var child = null;
    var self = this;

    categories.forEach(function (item) {
        id = item.attributeId;
        child = [];
        categoryChildrenMap[id] = child;
        categoryMap[id] = item.attributeName;

        // total category
        self.categoriesCount++;

        (item.optionList || []).forEach(function (opt) {
            cid = id + separator + opt.optionId;
            // total attribute
            self.attributesCount++;
            attributesMap[cid] = opt.optionName;
            child.push(cid)
        })
    });

    return {
        category: categoryMap,
        attributes: attributesMap,
        children: categoryChildrenMap
    };
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

