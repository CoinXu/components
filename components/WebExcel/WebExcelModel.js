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

/**
 * ### 解析从 Excel 中复制过来的数据，解析规则如下：
 *
 * office 2007 以 \t 作为两个单元格内容之前的分隔符
 * 在此WebExcel中，除了空格\s (32) 和 回车\n (10) 之外
 * 其他如 \v\r\f\t，皆作为分隔符
 * 所以在copy的内容中不要掺杂这些内容
 * google doc 可以做到完全copy~
 * 代码压缩了，查不到
 *
 *
 * ### 此处简单粗暴的定义规则如下：
 * * 不允许合并单元格
 * * 会将复制的字段按尽可能按已选择的单元格数量来匹配
 *
 * 如果分割出的字段大于已选中的单元格数量，则会将其中的空白单元格删除
 * 如果小于，则将空白字符作为一个单一的单元格
 *
 * @param str
 * @param focusCells
 * @returns {Array|*}
 */
WebExcelModel.prototype.parseStringFromExcel = function (str, focusCells) {

    //var splitter = /[\v\r\f\t\n]+/;
    var cellSplitter = /\t/;
    var columnSplitter = /\n/;
    var whiteSpaceChar = /(?:9|10|11|12|13|32|NaN)/;

    var contents = str.split(columnSplitter);

    contents = lang.map(contents, function (v) {
        return v.split(cellSplitter);
    });

    if (focusCells.length === 1) {
        return contents;
    }

    var f = focusCells[0],
        l = focusCells[focusCells.length - 1],
        num_x = Math.abs(f.x - l.x) + 1,
        num_y = Math.abs(f.y - l.y) + 1;

    var c_len = contents.length;
    var c_last = contents[c_len - 1];

    if (c_last.length === 1 && c_last[0] === '') {
        contents.splice(-1);
    }

    lang.forEach(contents, function (row) {
        // 复制的字段大于已选择的单元格的个数
        // 将多余的空白符删除
        var hasSpace = true;
        while (row.length > num_x && hasSpace) {
            for (var start = row.length - 1; start >= 0; start--) {
                if (row[start].length === 0 &&
                    whiteSpaceChar.test('' + row[start].charCodeAt(0))) {
                    row.splice(start, 1);
                    hasSpace = true;
                    break;
                } else if (start === 0) {
                    // 避免死循环
                    hasSpace = false;
                }
            }
        }

        // 如果过滤一次之后还大于所选，直接截掉
        if (row.length > num_x) {
            row.splice(num_x);
        }
    });

    lang.log(num_x, num_y);

    return contents;
};

module.exports = WebExcelModel;

