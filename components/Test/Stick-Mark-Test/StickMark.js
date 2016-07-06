/**
 * Created by xcp on 7/5/16.
 */

const ShippingMarkExcel = require('./scripts/ShippingMarkExcel');
const WebExcelModel = require('./scripts/WebExcelModel');
const Lang = require('./scripts/lib/lang');


// 基础模型
const ExcelModel = require('./scripts/WebExcelModel');

function StickMark(excel_parent, header_parent, model) {

  this.model = new ExcelModel({
    header: model.columnHeader.stiMarkList,
    rows: model.rows,
    onChange: function () {
      this.render();
    }.bind(this)
  });

  this.excel_parent = excel_parent;
  this.header_parent = header_parent;
  this.origin = model;
}

StickMark.prototype.render = function () {
  this.excel_parent.innerHTML = '';
  this.excel = new ShippingMarkExcel({
    parent: this.excel_parent,
    model: this.model
  });
  this.excel.render();
};

StickMark.prototype._addTest = function () {
  this.model.add({
    header: Lang.clone(this.model.props.header.slice(1), true),
    rows: Lang.clone(this.model.props.rows, true)
  })
};

module.exports = StickMark;


