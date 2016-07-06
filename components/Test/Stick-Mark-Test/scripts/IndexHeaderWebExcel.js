/**
 * @class Marmoset.Component.BaseWebExcel.IndexHeaderWebExcel
 * @extends Marmoset.Component.BaseWebExcel
 *
 * ## 带索引的表格
 *
 * * 实现 {@link Marmoset.Component.BaseWebExcel BaseWebExcel} 的所有功能
 * * 在 x 轴上和 y 轴上添加列和行的索引
 * * x 轴上以 A 为开始，y 轴上以 0 开始计数
 *
 * ## 调用方式
 *     Mar.use('IndexHeaderWebExcel', ['WebExcelModel'], function(IndexHeaderWebExcel, WebExcelModel){
 *        var indexHeaderWebExcel = new IndexHeaderWebExcel({
 *                 parent: document.querySelector('#BaseWebExcel'),
 *                 model: new WebExcelModel(10)
 *        });
 *        indexHeaderWebExcel.render()
 *     })
 */

var BaseWebExcel = require('./BaseWebExcel');
var lang = require('./lib/lang');

module.exports = BaseWebExcel.extend({
        /**
         * @property 默认配置
         * @type {Object}
         */
        defaultsConfig: {
            hasIndex: true
        },

        /**
         * @override
         * 在 model上添加索引数据
         * @param node
         */
        beforeRender: function (node) {
            this.config = lang.defaults(this.defaultsConfig,
                this.__super__.defaultsConfig);
            // 添加导航坐标
            var x = 65;
            var y = 1;
            var h = {};
            var i = 'index';

            // y 轴标识
            this.model.keys.unshift(i);
            lang.forEach(this.model.data, function (rows) {
                rows[i] = y++;
            });

            // x 轴标识
            lang.forEach(this.model.keys, function (prop, index) {
                h[prop] = index === 0 ?
                    '' :
                    lang.integerToString(x++);
            });

            this.model.data.unshift(h);
        }
    });
