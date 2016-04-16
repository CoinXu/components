/**
 * Created by xcp on 2016/4/15.
 */

const BaseWebExcel = require('./BaseWebExcel');
const dom = require('./lib/dom');
const query = require('./lib/query');
const WebExcelModel = require('./WebExcelModel');
const css = require('./assets/excel.css');
const lang = require('./lib/lang');

// todo 应该将Cover写成四条边线，不然没办法用鼠标操作Input
// todo 添加方向键移动框
// todo 添加回国键向下移动
// todo 添加除方向键和回车键之外，其他按键时直接输入到当前选中框
// todo 添加点击复制功能【有些麻烦，事件冲突，需要缓存上一次copy的内容】
// todo 添加每一个输入框blur时保存数据
// todo 输入框有必须、非填项
// todo 自定义输入框内容【插入html】
// todo 添加选择列功能
// todo 定位应该依赖于父容器，而不是依赖于窗口。如果依赖于窗口，则在滚动时会发成位置异常。

module.exports = BaseWebExcel.extend({

    defaultsConfig: {
        hasIndex: true,
        defaultSelect: [1, 1]
    },

    initialize: function (options) {
        this.__super__.initialize(lang.defaults(options || {}, this.defaultsConfig))
    },

    createCover: function () {
        var contentId = 'operate-wrap-' + lang.randomRange(10, 10, 100).join('');
        var copyId = 'copy-wrap-' + lang.randomRange(10, 10, 100).join('');
        this.node.removeChild(this.zeroClipboardNode);
        this.zeroClipboardNode.className = 'zero-clipboard-node';

        var region = dom.DOM.div({className: 'region'});
        region.innerHTML = `<div class="web-excel-point"></div>
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

        this.node.appendChild(region);
        query('#' + contentId)[0].appendChild(this.zeroClipboardNode);
        // todo 粘贴按钮，暂时用ctrl+v代替
        //query('#' + copyId).on('click', null, function (e, target) {
        //    excel.setCellsValueFromClipboard();
        //});
        return region;
    },

    operateCover: function () {
        // 注册事件监听
        // 单元格改变事件
        // 该事件会传递到所有的cell上
        var self = this;

        // 默认选中第[0,0]个位置
        var defaultCoord = this.config.defaultSelect;
        var defaultCell = this.getCellsWithCoords(defaultCoord[0], defaultCoord[1]);

        self.regionStart = self.regionEnd = defaultCell.node;
        self.focusCells = [defaultCell];

        var region = this.region = this.createCover();
        var $region = query(region);

        this.on('change', function (oldVal, newVal, cell) {
            console.log('cell\'s value changed: ', oldVal, newVal, cell.x, cell.y);
        });

        $region.on('mouseup', null, function (e) {
            // 点击复制的时候，不要乱动
            if( (e.target || e.srcElement).className.toLowerCase() === 'region') {
                self.isDragStatus = false;
                self.agentTextArea.focus();
                self.emit('endRegion')
            }
        });

        this.on('focusCells', function () {
            self.resetCover();
        });

        this.on('endRegion', function () {
            self.focusSelectedCells();
            self.cellOnEdit(self.regionStart);
        });

        self.focusSelectedCells();
        self.cellOnEdit(self.regionStart);
    },

    resetCover: function (coverRegion) {
        coverRegion = coverRegion || this.computedCoverRegion(this.focusCells);
        var start = coverRegion.start;
        var end = coverRegion.end;
        this.region.style.cssText = this.coverSize(
            start.x, start.y,
            end.x - start.x, end.y - start.y
        );
    },

    coverSize: function (x, y, w, h) {
        return `width:${w + 2}px;height:${h + 2}px;top:${y - 1}px;left:${x - 1}px;`
    },

    afterRender: function () {
        this.__super__.afterRender(this.node);
        lang.forEach(this.getRows(0), function (cell) {
            cell.node.style.cssText = `width:${cell.node.offsetWidth}px`;
        });
        this.operateCover();
    }
});