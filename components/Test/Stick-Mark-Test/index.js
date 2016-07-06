/**
 * Created by xcp on 7/5/16.
 */

const ShippingMarkExcel = require('./scripts/ShippingMarkExcel');
const WebExcelModel = require('./scripts/WebExcelModel');
const Data = require('./scripts/model/index').model;
const Lang = require('./scripts/lib/lang');


// 基础模型
const ExcelModel = require('./scripts/WebExcelModel');
const Parent = document.querySelector('#base-web-excel');
const ID = 'base-web-excel';

const render = function () {
  Parent.innerHTML = '';
  const excel = new ShippingMarkExcel({
    parent: Parent,
    cellWidth: '60px',
    model: Model
  });
  excel.render();
};

const Model = window.Model = new ExcelModel({
  header: Data.columnHeader.stiMarkList,
  rows: Data.rows,
  onChange: function () {
    render();
  }
});

render();

const nextHeader = Model.props.header.slice(1);
window.ModelAdd = function () {
  Model.add({
    header: Lang.clone(Data.columnHeader.stiMarkList, true),
    rows: Lang.clone(Data.rows, true)
  })
};

