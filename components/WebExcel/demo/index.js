/**
 * Created by xcp on 2016/4/12.
 */

const ShippingMarkExcel = require('../ShippingMarkExcel');
const WebExcelModel = require('../WebExcelModel');

// 基础模型
new ShippingMarkExcel({
    parent: document.querySelector('#base-web-excel'),
    model: new WebExcelModel(10)
}).render();
