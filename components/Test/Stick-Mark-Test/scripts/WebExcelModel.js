/**
 * 1. 计算一行有多少个格子
 * 2. 平均每一个格子的宽度[固定]
 * 3. 每一行的 props
 * 4. 缓存数据列表
 * 5. addColumn
 * 6. removeCoumn
 *
 */

const lang = require('./lib/lang');
const DOM = require('./lib/dom');
const noop = lang.noop;

function ExcelModel (props) {

  this.origin = {
    onChange: props.onChange,
    header: lang.clone(props.header, true),
    rows: lang.clone(props.rows, true)
  };

  this.props = lang.extend(this.getDefaultProps(), this.origin);
  this.initialize();
}

ExcelModel.prototype.initialize = function () {
  var props = this.props, rows, header;

  // Header 需要添加两个固定的字段: 编号、条形码
  // TODO 多语言
  props.header.unshift({
    fieldList: [
      {name: '商品编号-头'},
      {name: 'ESSA条形码-头'}
    ]
  });

  // header 的 key
  this.keys = this.getKeys(props.header);

  // 将后端数据的header转为excel组件需要的格式{key:value}或[]
  header = this.getHeader(props.header);
  // 将后端数据的行数据转为excel组件需要的格式
  rows = this.getRows(props.rows);

  // 数据太少,复制几份以作测试
  this.data = [header].concat(rows);

  // 如果某一列的单元格需要自定义生成内容
  // 可以通过注册勾子的方法来实现
  this.hooks = {};
  this.hooks[this.keys[0]] = {
    // keys的值为键
    get: function (model, name, x, y) {
      if (y === 0)
        return `<span>${model[name]}</span>`;
      return `<div>
        <img class="web-excel-img" src="${model[name].fileUrl}" alt="">
        <span class="web-excel-img-addtion">${model[name].skuNo}</span>
       </div>`;
    }.bind(this),
    set: function (model, name, x, y) {
      return null;
    }
  };

  return this;
};

ExcelModel.prototype.getDefaultProps = function () {
  return {
    header: [],
    rows: [],
    onChange: noop
  }
};

ExcelModel.prototype.getKeys = function (header) {
  var mark_list = lang.clone(header, true);
  var keys = [];
  var start = 0;
  var temp = 0;

  lang.forEach(mark_list, function (mark) {
    lang.forEach(mark.fieldList, function (filed) {
      temp = start;
      keys[temp] = temp;
      start++;
    })
  });

  return keys;
};

ExcelModel.prototype.getHeader = function (list) {
  var start = 0, header = [];

  lang.forEach(list, function (mark) {
    lang.forEach(mark.fieldList, function (filed) {
      header[start++] = filed.name;
    })
  });

  return header;
};

ExcelModel.prototype.getRows = function (list) {
  var column = [], start, row;
  var keys = this.keys;

  lang.forEach(list, function (item, index) {
    // 头两列是固定内容
    start = 2;
    row = [];
    column[index] = row;
    row[keys[0]] = {fileUrl: item.fileUrl, skuNo: item.skuNo};
    row[keys[1]] = item.skuBarCode;
    lang.forEach(item.stiMarkList, function (obj) {
      lang.forEach(obj.fieldList, function (filed) {
        row[keys[start++]] = filed.fieldValue
      });
    })
  });

  return column;
};

/**
 * 添加header
 * @param header
 * @param silent 如果 silent 为真值,则不会触发UI变化
 */
ExcelModel.prototype.addHeader = function (header, silent) {
  if (lang.isArray(header) && header.length) {
    this.props.header = this.props.header.concat(header);
    this.onChange(silent)
  }
};

ExcelModel.prototype.removeHeader = function (start, end, silent) {
  if (lang.isNumber(start) || lang.isNumber(end)) {
    var items = 0;
    var props = this.props;

    props.header = lang.filter(props.header, function (list) {

      list.fieldList = lang.filter(list.fieldList, function () {
        var ret = items < start || items >= end;
        items++;
        return ret;
      }, this);

      return list.fieldList.length;
    }, null);

    this.onChange(silent)
  }
};

ExcelModel.prototype.removeColumn = function (start, end, silent) {
  // start end 可以为正负,所以只判断是否为number
  if (lang.isNumber(start) || lang.isNumber(end)) {
    var props = this.props;
    var cur_rows = props.rows;
    // 头两列不计算
    var items = 2;

    props.rows = lang.filter(cur_rows, function (list) {
      // 单行
      items = 2;
      list.stiMarkList = lang.filter(list.stiMarkList, function (field) {
        field.fieldList = lang.filter(field.fieldList, function () {
          var ret = items < start || items >= end;
          items++;
          return ret;
        }, null);

        return field.fieldList.length
      }, this);

      return list.stiMarkList.length
    }, null);

    this.onChange(silent)
  }
};

ExcelModel.prototype.addColumn = function (rows, silent) {

  var origin, next;
  var props = this.props;
  var cur_rows = props.rows;

  if (lang.isArray(rows) && !rows.length) return cur_rows;

  if (!cur_rows.length) {
    props.rows = cur_rows.concat(rows)
  }
  else {
    lang.forEach(cur_rows, function (row, index) {
      origin = row.stiMarkList;
      next = rows[index] ? rows[index].stiMarkList : null;

      // 将所有的行追加到对应的位置
      if (lang.isArray(next)) {
        row.stiMarkList = origin.concat(next)
      }
    })
  }

  this.onChange(silent)
};

ExcelModel.prototype.remove = function (start, end) {
  this.removeHeader(start, end, true);
  this.removeColumn(start, end, false);
};

/**
 * model 发生变化时,需要重新生成 key
 * @param silent
 */
ExcelModel.prototype.onChange = function (silent) {
  this.keys = this.getKeys(this.props.header);
  var rows = this.getRows(this.props.rows);
  var header = this.getHeader(this.props.header);
  this.data = this.data = [header].concat(rows);

  if (!silent)
    this.props.onChange();
};

ExcelModel.prototype.add = function (props) {
  if (lang.isObject(props) && lang.every(['header', 'rows'], function (item) {
        return lang.isArray(props[item]) && props[item].length
      })) {

    this.addHeader(props.header, true);
    this.addColumn(props.rows);
  }
};

module.exports = ExcelModel;