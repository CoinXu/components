/**
 * Created by xcp on 2016/4/12.
 */

const ShippingMarkExcel = require('../ShippingMarkExcel');
const WebExcelModel = require('../WebExcelModel');
const DOM = require('../lib/dom').DOM;

const ShippingMarkVirtualData = {
    "message": "测试内容g42c",
    "model": {
        "columnHeader": {
            "stiMarkList": [{
                "code": "s11",
                "fieldList": [{
                    "fieldId": 1,
                    "fieldInterId": 11,
                    "name": "",
                    value: ""
                }],
                "name": "测试内容5v8g",
                "stimarkId": "测试内容ccqv",
                "type": "测试内容6rvr"
            }]
        },
        "rows": [{
            "fileUrl": "https://www.baidu.com/img/bd_logo1.png",
            "id": 1,
            "skuBarCode": "SKU条码",
            "skuNo": "SKU编号",
            "stiMarkList": [{
                "code": "s11",
                "fieldList": [{
                    "fieldId": 1,
                    "fieldInterId": 11,
                    "name": "",
                    value: ""
                }],
                "name": "测试内容9riw",
                "stimarkId": "测试内容8wtt",
                "type": "测试内容ki97"
            }]
        }]
    },
    "success": true
};

// 基础模型
new ShippingMarkExcel({
    beforeRender: function (node) {
        node.appendChild(DOM.div({
            className: 'row',
            innerHTML: '123'
        }))
    },
    parent: document.querySelector('#base-web-excel'),
    model: new WebExcelModel(10)
}).render();


