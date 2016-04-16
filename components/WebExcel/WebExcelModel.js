/**
 * ### 假装有个 Model 对象，将所有的 Model 挂在下面...
 * @class Marmoset.Model.WebExcelModel
 * @param {Number} listNumber 初始化时生成的数据的数量
 *
 * ### WebExcel 的 Model，用于数据的存取和处理，此处在测试环境生成一个测试数据
 */

var Model = require('./Model');
var lang = require('./lib/lang');

function WebExcelModel(listNumber) {
    this.initialize(listNumber);
}

/**
 * 初始化时，生成 this.data 和 this.keys
 * @param listNumber
 */
WebExcelModel.prototype.initialize = function (listNumber) {
    this.data = Model.dataList(listNumber);
    this.keys = lang.keys(this.data[0]);
};

/**
 * 通过 x, y 坐标点获得对应的数据
 * @param x
 * @param y
 * @returns {*}
 */
WebExcelModel.prototype.getDataWithCoords = function (x, y) {
    return this.data[y][this.getPropWithX(x)];
};

/**
 * 通过 x 轴获取对应的属性名
 * @param x
 * @returns {*}
 */
WebExcelModel.prototype.getPropWithX = function (x) {
    return this.keys[x];
};

module.exports = WebExcelModel;

