/**
 * Created by xcp on 2016/4/12.
 */

const WebExcel = require('../index');
const WebExcelModel = require('../WebExcelModel');

// 基础模型
new WebExcel({
    mountNode: document.querySelector('#base-web-excel'),
    model: new WebExcelModel(10)
}).render();
