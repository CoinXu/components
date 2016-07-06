function SkuRender(config) {
    this.wrapper = this.wayWrapper = this.originData = this.parse = null;
    this.configs = config;
    this.template = config.template || config.template;
    this.bind = config.bind || this.bind;

    this.baseClass = 'sku-item';
    this.classNameMap = {
        disabled: this.baseClass + ' no-drop',
        normal: this.baseClass,
        current: this.baseClass + ' curr'
    }
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
    var base = this.skuBaseClass;
    var curr = this.skuCurrentClass;
    this.wrapper.addEventListener('click', function (e) {
        var t = e.target,
            c = t.className,
            v = t.dataset['id'];

        if (c.indexOf(base) > -1) {
            // active status
            this.parse[c.indexOf(curr) > -1 ? 'remove' : 'add'](v);
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

