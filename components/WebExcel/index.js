/**
 * Created by xcp on 2016/4/13.
 */


const IndexHeaderWebExcel = require('./IndexHeaderWebExcel');
const BaseWebExcel = require('./BaseWebExcel');
const dom = require('./lib/dom');
const query = require('./lib/query');
const WebExcelModel = require('./WebExcelModel');
const css = require('./assets/excel.css');
const lang = require('./lib/lang');


function WebExcelWrapper(options) {
    this.webExcel = new BaseWebExcel({
        parent: options.mountNode,
        model: options.model
    });
    this.bindOperateUi();
}

WebExcelWrapper.prototype.bindOperateUi = function () {

    // 注册事件监听
    // 单元格改变事件
    // 该事件会传递到所有的cell上
    const excel = this.webExcel;
    const self = this;

    excel.on('change', function (oldVal, newVal, cell) {
        console.log('cell\'s value changed: ', oldVal, newVal, cell.x, cell.y);
    });

    // 单元格render后事件
    // 该事件会传递到所有的cell上
    excel.on('cellRender', function (cell) {
        console.log('cellRender', cell.x, cell.y);
    });

    var region = dom.DOM.div({className: 'region'});
    var $region = query(region);

    excel.node.appendChild(region);

    $region.on('mouseup', null, function (e) {
        excel.isDragStatus = false;
        excel.agentTextArea.focus();
        excel.emit('endRegion', excel.regionEnd)
    });

    // 鼠标进行选择时事件
    // 比如画出所选范围
    //excel.on('moving', function (startNode, endNode, focusCells) {
    //    var start = {x: startNode.offsetLeft, y: startNode.offsetTop};
    //    var end = {
    //        x: endNode.offsetLeft + endNode.offsetWidth,
    //        y: endNode.offsetTop + endNode.offsetHeight
    //    };
    //
    //    region.style.cssText = 'top:' + start.y + 'px;left:' + start.x
    //        + 'px;width:' + (end.x - start.x) + 'px;height:'
    //        + (end.y - start.y) + 'px';
    //});

    excel.on('moving', function (startNode, endNode, focusCells, coverRegion) {
        var start = coverRegion.start;
        var end = coverRegion.end;
        region.style.cssText = self.styleCssText(start.x, start.y, end.x - start.x, end.y - start.y);
    });

    excel.on('startRegion', function (startNode) {
        region.style.cssText = self.styleCssText(
            startNode.offsetLeft,
            startNode.offsetTop,
            startNode.offsetWidth,
            startNode.offsetHeight
        );
        excel.blurSelectedCells(excel.focusCells);
        try {
            excel.node.appendChild(region)
        } catch (e) {
        }
    });

    excel.on('endRegion', function (endNode) {
        try {
            if (excel.regionStart === excel.regionEnd) {
                excel.cellOnFocus(excel.regionStart);
            }
            excel.cellOnEdit(excel.regionStart)
        } catch (e) {
        }
    });
};

WebExcelWrapper.prototype.styleCssText = function (x, y, w, h) {
    return `width:${w}px;height:${h}px;top:${y}px;left:${x}px;`
};

WebExcelWrapper.prototype.render = function () {
    this.webExcel.render();
};

module.exports = WebExcelWrapper;