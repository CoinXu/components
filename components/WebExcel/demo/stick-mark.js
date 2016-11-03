/**
 * Created by xcp on 7/5/16.
 */

const ShippingMarkExcel = require('../ShippingMarkExcel');
const Lang = require('../lib/lang');

// 基础模型
const ExcelModel = require('../WebExcelModel');

function StickMark(excel_parent, model) {

  this.model = new ExcelModel({
    header: model.columnHeader.stiMarkList,
    rows: model.rows,
    onChange: function () {
      this.render();
    }.bind(this)
  });

  this.excel_parent = excel_parent;
  this.origin = model;
}

StickMark.prototype.render = function () {
  this.excel_parent.innerHTML = '';
  this.excel = new ShippingMarkExcel({
    parent: this.excel_parent,
    model: this.model
  });
  this.excel.render();

  return this;
};

StickMark.prototype._addTest = function () {
  this.model.add({
    header: Lang.clone(this.model.props.header.slice(1), true),
    rows: Lang.clone(this.model.props.rows, true)
  })
};

module.exports = StickMark;


