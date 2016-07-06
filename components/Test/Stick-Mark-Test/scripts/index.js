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
    lang.extend(this.options = {defaultSelect: [1, 1]}, options);
    this.resetCover = this._resetCover();

    this.webExcel = new IndexHeaderWebExcel({
        parent: this.options.mountNode,
        model: this.options.model,
        afterPaste: this.resetCover
    });
}

WebExcelWrapper.prototype.createCover = function () {
    var excel = this.webExcel;
    var contentId = 'operate-wrap-' + lang.randomRange(10, 10, 100).join('');
    var copyId = 'copy-wrap-' + lang.randomRange(10, 10, 100).join('');

    excel.node.removeChild(excel.zeroClipboardNode);
    excel.zeroClipboardNode.className = 'zero-clipboard-node';

    var region = dom.DOM.div({className: 'region'});
    region.innerHTML = `
    <div class="web-excel-point"></div>
    <div class="bub bub-dir-t" style="position: absolute;
        bottom:-52px;width:102px;right:0;margin-right:-51px;">
        <span class="bub-symbol icon-img icon-arrow-blue-t" style="left:41px;"></span>
        <div class="bub-con bub-all-pd">
        <ul class="list list-inline list-st util-line-s">
            <li id="${contentId}"></li>
            <!--<li id="${copyId}">粘贴</li>-->
        </ul>
        </div>
    </div>`;

    document.body.appendChild(region);
    query('#' + contentId)[0].appendChild(excel.zeroClipboardNode);
    // todo 粘贴按钮，暂时用ctrl+v代替
    //query('#' + copyId).on('click', null, function (e, target) {
    //    excel.setCellsValueFromClipboard();
    //});
    return region;
};

WebExcelWrapper.prototype.bindOperateUi = function () {

    // 注册事件监听
    // 单元格改变事件
    // 该事件会传递到所有的cell上
    const excel = this.webExcel;
    const self = this;

    var region = this.region = this.createCover();
    var $region = query(region);

    // 默认选中第[0,0]个位置
    var defaultCoord = this.options.defaultSelect;
    var defaultCell = excel.getCellsWithCoords(defaultCoord[0], defaultCoord[1]);
    excel.regionStart = defaultCell.node;
    excel.focusCells = [defaultCell];
    excel.cellOnFocus(excel.regionStart);
    excel.cellOnEdit(excel.regionStart);
    this.resetCover();

    excel.on('change', function (oldVal, newVal, cell) {
        console.log('cell\'s value changed: ', oldVal, newVal, cell.x, cell.y);
    });

    $region.on('mouseup', null, function (e) {
        excel.isDragStatus = false;
        excel.agentTextArea.focus();
        excel.emit('endRegion', excel.regionEnd)
    });

    //excel.on('moving', function (startNode, endNode, focusCells, coverRegion) {
    //    self.resetCover(coverRegion);
    //});

    excel.on('focusCells', function () {
        self.resetCover();
    });

    excel.on('startRegion', function (startNode) {
        self.resetCover();
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
            self.resetCover();
        } catch (e) {
        }
    });
};

WebExcelWrapper.prototype._resetCover = function () {
    var self = this;
    return function (coverRegion) {
        var excel = self.webExcel;
        coverRegion = coverRegion || excel.computedCoverRegion(excel.focusCells);
        var start = coverRegion.start;
        var end = coverRegion.end;
        self.region.style.cssText = self.styleCssText(
            start.x, start.y,
            end.x - start.x, end.y - start.y
        );
    }
};

WebExcelWrapper.prototype.styleCssText = function (x, y, w, h) {
    return `width:${w + 2}px;height:${h + 2}px;top:${y - 1}px;left:${x - 1}px;`
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
    });
    this.bindOperateUi();
};

module.exports = WebExcelWrapper;