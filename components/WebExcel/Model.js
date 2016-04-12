/**
 * @class Marmoset.Model
 * ## 生成一些测试数据，并作为其他 Model 在文档上的挂载
 */

var lang = require('./lib/lang');
module.exports = {

    /**
     * @method
     * 生成当前环境下带前缀的唯一 id
     * @type {Function}
     */
    unique: function (prefix) {
        var start = 0;
        return function () {
            return (prefix || 'uuid-') + start++;
        };
    }(),

    /**
     * 生成一条 webExcel 测试数据
     * @returns {{commodity: *, essaCommodityCode: *, wrapperCode: string, innerCode: string, orderCode: string, userCommodityCode: string, date: string, node: string}}
     */
    one: function () {
        return {
            commodity: this.unique('commodity-'),
            essaCommodityCode: lang.range(100000, 200000),
            wrapperCode: lang.randomRange(10, 1, 20).join(''),
            innerCode: lang.randomRange(10, 0, 10).join(''),
            orderCode: lang.randomRange(6, 0, 10).join(''),
            // ascii 码中 A-Z及 a-z
            userCommodityCode: lang.integerListToString(lang.randomRange(20, 65, 123)),
            date: new Date().toLocaleDateString(),
            // 注释，unicode 中文字符范围 4E00 －9FA5
            node: lang.integerListToString(lang.randomRange(10,
                lang.unicodeToInteger('\\U4E00'), lang.unicodeToInteger('\\U9FA5')))
        };
    },

    /**
     * 生成多条 webExcel 测试数据
     * @param length
     * @returns {Array}
     */
    dataList: function (length) {
        var ret = [];
        var nameMap = {
            commodity: '商品编号',
            essaCommodityCode: 'ESSA商品条码',
            wrapperCode: '外箱条码',
            innerCode: '内箱条码',
            orderCode: '客户货号',
            userCommodityCode: '商户条形码',
            date: '生产日期',
            node: '备注'
        };

        for (var i = 0; i < length; i++) {
            ret.push(this.one());
        }

        // 表头数据
        var name = {};
        lang.each(ret[0], function (val, prop) {
            name[prop] = nameMap[prop];
        });

        ret.unshift(name);

        return ret;
    }
};
