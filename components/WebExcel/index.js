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
    lang.extend(this.options = {defaultSelect: [0, 0]}, options);
    this.webExcel = new BaseWebExcel({
        parent: this.options.mountNode,
        model: this.options.model
    });
}

WebExcelWrapper.prototype.createCover = function () {
    var excel = this.webExcel;
    var contentId = 'operate-wrap-' + lang.randomRange(10, 10, 100).join('');

    excel.node.removeChild(excel.zeroClipboardNode);
    excel.zeroClipboardNode.style.cssText = 'border:0;outline:0;background:none;height:12px;cursor:pointer;';

    var region = dom.DOM.div({className: 'region'});
    region.innerHTML = `
    <div class="web-excel-point"></div>
    <div class="bub bub-dir-t" style="position: absolute;
        bottom:-58px;width:102px;right:0;margin-right:-51px;">
        <span class="bub-symbol icon-img icon-arrow-blue-t" style="left:41px;"></span>
        <div class="bub-con bub-all-pd">
        <ul class="list list-inline list-st util-line-s">
            <li id="${contentId}"></li>
            <li>粘贴</li>
        </ul>
        </div>
    </div>`;

    // 默认选中第[0,0]个位置
    var defaultCoord = this.options.defaultSelect;
    var defaultNode = excel.getRows(defaultCoord[0])[defaultCoord[1]].node;

    excel.regionStart = defaultNode;

    region.style.cssText = this.styleCssText(
        defaultNode.offsetLeft,
        defaultNode.offsetTop,
        defaultNode.offsetWidth,
        defaultNode.offsetHeight
    );

    excel.node.appendChild(region);
    query('#' + contentId)[0].appendChild(excel.zeroClipboardNode);

    excel.cellOnFocus(excel.regionStart);
    excel.cellOnEdit(excel.regionStart);

    return region;
};

WebExcelWrapper.prototype.bindOperateUi = function () {

    // 注册事件监听
    // 单元格改变事件
    // 该事件会传递到所有的cell上
    const excel = this.webExcel;
    const self = this;

    excel.on('change', function (oldVal, newVal, cell) {
        console.log('cell\'s value changed: ', oldVal, newVal, cell.x, cell.y);
    });

    var region = this.createCover();
    var $region = query(region);

    $region.on('mouseup', null, function (e) {
        excel.isDragStatus = false;
        excel.agentTextArea.focus();
        excel.emit('endRegion', excel.regionEnd)
    });

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
        // todo 应该将Cover写成四条边线，不然没办法用鼠标操作Input
        try {
            if (excel.regionStart === excel.regionEnd) {
                excel.cellOnFocus(excel.regionStart);
                excel.cellOnEdit(excel.regionStart)
            }
        } catch (e) {
        }
    });
};

WebExcelWrapper.prototype.styleCssText = function (x, y, w, h) {
    return `width:${w}px;height:${h}px;top:${y}px;left:${x}px;`
};

WebExcelWrapper.prototype.render = function () {
    this.webExcel.render();
    this.afterRender();
};

WebExcelWrapper.prototype.afterRender = function () {
    // 渲染完成后，计算格式的宽度
    // 以满足自适应的需求
    lang.forEach(this.webExcel.getRows(0), function (cell) {
        cell.node.style.cssText = `width:${cell.node.offsetWidth}px`;
        console.log(cell)
    });
    this.bindOperateUi();
};

module.exports = WebExcelWrapper;