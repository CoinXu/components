/**
 * Created by xcp on 2016/4/15.
 */

const BaseWebExcel = require('./BaseWebExcel');
const dom = require('./lib/dom');
const lang = require('./lib/lang');
const query = require('./lib/query');

// todo 应该将Cover写成四条边线，不然没办法用鼠标操作Input
// todo 添加方向键移动框
// todo 添加回车键向下移动
// todo 添加除方向键和回车键之外，其他按键时直接输入到当前选中框
// todo 添加点击复制功能【有些麻烦，事件冲突，需要缓存上一次copy的内容】
// todo 添加每一个输入框blur时保存数据
// todo 输入框有必须、非填项
// todo 自定义输入框内容【插入html】
// todo 添加选择列功能
// todo 定位应该依赖于父容器，而不是依赖于窗口。如果依赖于窗口，则在滚动时会发成位置异常。

module.exports = BaseWebExcel.extend({

  STATUS: {
    COVER_HIDE: 0,
    COVER_SHOW: 1,
    PARENT_ID: 'PARENT_ID'
  },

  defaultsConfig: {
    hasIndex: true,
    cellWidth: 'auto',
    defaultSelect: [1, 1]
  },

  initialize: function (options) {

    this.on('onCellChange', function (val) {
      console.log('onCellChange', val)
    });

    this.wrapper = this.parent;

    var wrap = dom.DOM.div({
      style: 'overflow:hidden;position:relative;'
    });

    this.parent = dom.DOM.div({
      id: this.STATUS.PARENT_ID,
      style: 'width:100%;overflow-x:auto;margin-bottom:64px;;'
    });

    wrap.appendChild(this.parent);

    this.wrapper.appendChild(wrap);

    this.__super__.initialize(lang.defaults(options || {}, this.defaultsConfig))
  },

  createCover: function () {
    var contentId = 'operate-wrap-' + lang.randomRange(10, 10, 100).join('');
    var copyId = 'copy-wrap-' + lang.randomRange(10, 10, 100).join('');
    this.zeroClipboardNode.className = 'zero-clipboard-node';

    var region = dom.DOM.div({className: 'region'});

    var html = ['<div class="web-excel-point"></div>'];

    html.push('<div class="bub bub-dir-t" style="position: absolute;');
    html.push('bottom:-52px;width:50px;right:0;margin-right:-24px;">');
    html.push('<span class="bub-symbol icon-img icon-arrow-blue-t"');
    // 21*10
    html.push('style="left:50%;margin-left:-10px;">');
    html.push('</span>');
    html.push('<div class="bub-con bub-all-pd">');
    html.push('<ul class="list list-inline list-st util-line-s">');
    html.push(`<li id="${contentId}"></li>`);
    html.push('</ul>');
    html.push('</div>');
    html.push('</div>');

    region.innerHTML = html.join('');

    this.parent.appendChild(region);
    query('#' + contentId)[0].appendChild(this.zeroClipboardNode);
    // todo 粘贴按钮，暂时用ctrl+v代替
    //query('#' + copyId).on('click', null, function (e, target) {
    //    excel.setCellsValueFromClipboard();
    //});

    this._parentScrollLeft = 0;
    this.$parent = query(this.parent);
    this.$parent.on('scroll', '#' + this.STATUS.PARENT_ID, function (e) {
      this._parentScrollLeft = this.parent.scrollLeft;
      this.resetCover();
    }.bind(this));
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

    if (!defaultCell) return;

    self.regionStart = self.regionEnd = defaultCell.node;
    self.focusCells = [defaultCell];

    var region = this.region = this.createCover();
    var $region = query(region);

    this.on('change', function (oldVal, newVal, cell) {
      console.log('cell\'s value changed: ', oldVal, newVal, cell.x, cell.y);
    });

    $region.on('mouseup', null, function (e) {
      // 点击复制的时候，不要乱动
      if ((e.target || e.srcElement).className.toLowerCase() === 'region') {
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
      // 只选中一个
      if (self.focusCells.length === 1)
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
        start.x - this._parentScrollLeft, start.y,
        end.x - start.x, end.y - start.y
    );
  },

  coverSize: function (x, y, w, h) {
    return `width:${w + 2}px;height:${h + 2}px;top:${y - 1}px;left:${x - 1}px;`
  },

  afterRender: function () {
    var total = 0;
    var w = 0;

    this.__super__.afterRender(this.node);

    lang.forEach(this.getRows(0), function (cell) {
      w = cell.node.offsetWidth;
      total = total + w;
      cell.node.style.cssText = `width:${w}px`;
    });

    this.operateCover();
  }
});