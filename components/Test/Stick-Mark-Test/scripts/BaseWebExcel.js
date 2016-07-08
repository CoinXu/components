var lang = require('./lib/lang');
var Component = require('./Component');
var Cell = require('./cell');
var query = require('./lib/query');
var dom = require('./lib/dom');
var ZeroClipboard = require('./lib/ZeroClipboard');

ZeroClipboard.config({
  swfPath: '/components/components/WebExcel/lib/ZeroClipboard.swf'
});

module.exports = Component.extend({

  /**
   * @property
   * 版本号
   * @type {String}
   */
  version: '0.1.0',

  doc: document,

  /**
   * @property
   * 数据模型，包含一些属性和方法，见：
   * {@link WebExcelModel WebExcelModel}
   */
  model: [],

  /**
   * @property
   * 默认配置
   * @type {Object}
   */
  defaultsConfig: {
    disabledRegion: function (x, y) {
      return false;
    },
    hasIndex: false,
    copyText: '复制',
    // 单元格class
    cellClassName: 'cell',
    // 激状态单元格class
    activeCellClassName: 'con-cell',
    // 索引行单元格class
    // 点击会选中当前行
    indexRowCellClassName: 'col-row-cell',
    // 索引列单元格class
    // 点击会选中当前列
    indexColumnCellClassName: 'col-index-cell',

    cellWidth: 'auto'
  },

  /**
   * @override
   * @param options
   */
  initialize: function (options) {
    this.config = lang.defaults(options || {}, this.defaultsConfig);

    this.cells = [];

    // 选中的单元格
    this.focusCells = null;
    // 拖动选择状态
    this.isDragStatus = null;

    // 计算选中的区域
    this.regionStart = this.regionEnd = null;

    // 创建 node
    this.node = dom.DOM.div({
      className: 'web-excel-wrapper table',
      onselectstart: 'return false'
    });

    // 创建一个复制代理textarea
    this.agentTextArea = dom.DOM.textarea({
      className: 'agent-text-area'
    });

    this.doc.body.appendChild(this.agentTextArea);

    this.zeroClipboardNode = null;

    this.$node = query(this.node);
    this.parent = this.config.parent;
  },

  /**
   * @override
   * @param node
   * @returns {Marmoset.Component.BaseWebExcel}
   */
  beforeRender: function (node) {
    return this;
  },

  /**
   * @override
   * @chainable
   * @param node
   * @returns {Marmoset.Component.BaseWebExcel}
   */
  afterRender: function (node) {
    var targetId = 'zero-clipboard-target-' +
        lang.randomRange(10, 10, 100).join('');

    this.zeroClipboardNode = dom.DOM.button({
      className: 'clipboard-btn',
      innerHTML: this.config.copyText,
      'data-clipboard-target': targetId
    });

    this.zeroClipboardTarget = dom.DOM.input({
      type: 'hidden',
      id: targetId
    });

    this.parent.appendChild(this.zeroClipboardNode);
    this.parent.appendChild(this.zeroClipboardTarget);

    var clipboard =
        this.zeroClipboard =
            new ZeroClipboard(this.zeroClipboardNode);

    clipboard.on('ready', function () {
      clipboard.on('aftercopy', function (event) {
        lang.log('copy data: ', event.data);
      });
    });

    return this;
  },

  /**
   * @override
   * @returns {Marmoset.Component.BaseWebExcel}
   */
  render: function () {
    this.beforeRender(this.node);

    var node = null;

    lang.forEach(this.model.data, function (v, i) {
      node = this.renderOne(v, i);
      this.node.appendChild(node);
    }, this);

    this.content = this.node.outerHTML;
    this.attachToDOM(this.parent);

    this.event(this.$node);

    return this;
  },

  /**
   * @param model
   * @param index
   * @returns {*}
   */
  renderOne: function (model, index) {
    var div = dom.DOM.div({className: 'row'}),
        cell = null,
        cells = [];
    var config = this.config, className = null,
        con = config.activeCellClassName,
        ci = config.indexColumnCellClassName,
        ri = config.indexRowCellClassName,
        cn = ' ' + config.cellClassName;

    lang.forEach(this.model.keys, function (prop, idx) {

      var className = [];
      // 是否禁用
      // index 行
      // idx 列
      if (!config.disabledRegion(index, idx)) {
        className.push(con)
      }

      // 是否有表头
      if (config.hasIndex) {
        className.push(index === 0 ? ri : idx === 0 ? ci : con)
      }

      className = className.join(' ');

      cell = new Cell({
        y: index, x: idx,
        width: config.cellWidth,
        model: model, name: prop,
        contentHooks: this.model.hooks[prop],
        nodeAttr: {
          className: className + cn,
          'data-cell-name': prop,
          'data-mark': idx + ':' + index
        }
      });

      // 将当前事注册到每个cell上
      lang.each(this._events, function (events, name) {
        if (lang.isArray(events)) {
          lang.forEach(events, function (event) {
            cell.on(name, event.fn, event.context,
                event.data, event.context);
          });
        }
      });

      cells.push(cell);
      div.appendChild(cell.render().node);
    }, this);

    this.cells.push(cells);
    return div;
  },

  /**
   *
   * @param $node
   */
  event: function ($node) {
    // todo 点击编辑事件
    this.bindEdit($node);

    // todo 选择复制事件
    this.bindDragCopy($node);

    // todo 鼠标选择复制事件
    this.bindMoveCopy($node);
  },

  /**
   *
   * @param $node
   */
  bindEdit: function ($node) {
    var self = this;
    var config = this.config, dot = '.';
    this.isInputFocusStatus = false;
    // 获得焦点
    $node.on('click', dot + config.activeCellClassName,
        function (e, target) {
          if (self.isInputFocusStatus) {
            return null;
          }
          self.isDragStatus = false;
          self.cellOnFocus(target);
        });

    // 双击编辑
    $node.on('dblclick', dot + config.activeCellClassName,
        function (e, target) {
          if (self.isInputFocusStatus) {
            return null;
          }
          self.isDragStatus = false;
          self.cellOnEdit(target);
        });

    // 失去焦点
    $node.on('blur', 'input', function (e, target) {
      self.isDragStatus = false;
      self.isInputFocusStatus = false;
      self.cellOnBlur(target);
    });

    $node.on('focus', 'input', function (e, target) {
      self.isInputFocusStatus = true;
    });

    // 选择整列
    $node.on('click', dot + config.indexRowCellClassName,
        function (e, target) {
          self.focusOneColumn(self.getCoords(target).x);
        });

    // 选择整行
    $node.on('click', dot + config.indexColumnCellClassName,
        function (e, target) {
          self.focusOneRow(self.getCoords(target).y);
        });
  },

  /**
   * * 绑定拖动鼠标选择区域单元格事件
   * * 创建代理 textarea 实现 `ctrl+v` 复制事件
   * @param $node
   */
  bindMoveCopy: function ($node) {
    var self = this;

    var findParent = function (node) {
      return node.getAttribute('data-mark') ?
          node : node.parentNode;
    };

    var mouseDown = function (e, d) {
      // 如果处于输入状态
      self.isDragStatus = true;
      self.regionStart = self.regionEnd = findParent(e.target);
      self.emit('startRegion', self.regionStart);
    };

    var mouseUp = function (e, d) {
      if (self.isDragStatus && !self.isInputFocusStatus) {
        self.agentTextArea.focus();
      }
      self.isDragStatus = false;
      self.regionEnd = findParent(e.target);
      self.emit('endRegion', self.regionEnd);
    };

    var mouseMove = function (e, d) {
      lang.log(self.isInputFocusStatus, 'mouseMove');
      // 如果不是处于拖动状态，直接返回
      if (!self.isDragStatus || self.isInputFocusStatus) {
        return null;
      }
      self.regionEnd = findParent(e.target);
      self.focusSelectedCells();
      self.emit('moving',
          self.regionStart,
          self.regionEnd,
          self.focusCells,
          self.computedCoverRegion(self.focusCells)
      );
    };

    $node.onDrag('.' + this.config.activeCellClassName, mouseDown, mouseMove, mouseUp);

    // 创建一个代理textArea，实现复制功能
    var agentText = query(this.agentTextArea);

    agentText.on('change', null, function (e, target) {
      self.setCellsValue(target.value);
      target.value = '';
      self.resetCover();
    });

    agentText.on('input', null, function (e, target) {
      target.blur();
    });
  },

  bindDragCopy: function ($node) {

  },

  /**
   * 设置单元格的值；content 会通过 `this.parseStringFromExcel` 函数
   * 来解析成该组件能识别的格式
   * @param content
   * @returns {Marmoset.Component.BaseWebExcel}
   */
  setCellsValue: function (content) {
    if (lang.getLength(this.focusCells) < 1) {
      return this;
    }
    content = this.parseStringFromExcel(content, this.focusCells);
    var index = 0, coords;
    lang.forEach(content, function (row) {

      if (lang.isArray(row)) {
        lang.forEach(row, function (v) {
          coords = this.focusCells[index++];
          if (!coords) {
            return true;
          }
          this.getCellsWithCoords(coords.x, coords.y).setModelValue(v);
        }, this);
      }
    }, this);

    return this;
  },

  /**
   * ### 解析从 Excel 中复制过来的数据，解析规则如下：
   *
   * office 2007 以 \t 作为两个单元格内容之前的分隔符
   * 在此WebExcel中，除了空格\s (32) 和 回车\n (10) 之外
   * 其他如 \v\r\f\t，皆作为分隔符
   * 所以在copy的内容中不要掺杂这些内容
   * google doc 可以做到完全copy~
   * 代码压缩了，查不到
   *
   *
   * ### 此处简单粗暴的定义规则如下：
   * * 不允许合并单元格
   * * 会将复制的字段按尽可能按已选择的单元格数量来匹配
   *
   * 如果分割出的字段大于已选中的单元格数量，则会将其中的空白单元格删除
   * 如果小于，则将空白字符作为一个单一的单元格
   *
   * @param str
   * @param focusCells
   * @returns {Array|*}
   */

  parseStringFromExcel: function (str, focusCells) {
    //var splitter = /[\v\r\f\t\n]+/;
    var cellSplitter = /\t/;
    var columnSplitter = /\n/;
    var whiteSpaceChar = /(?:9|10|11|12|13|32|NaN)/;

    var contents = str.split(columnSplitter);

    contents = lang.map(contents, function (v) {
      return v.split(cellSplitter);
    });

    if (focusCells.length === 1) {
      return contents;
    }

    var f = focusCells[0],
        l = focusCells[focusCells.length - 1],
        num_x = Math.abs(f.x - l.x) + 1,
        num_y = Math.abs(f.y - l.y) + 1;

    var c_len = contents.length;
    var c_last = contents[c_len - 1];

    if (c_last.length === 1 && c_last[0] === '') {
      contents.splice(-1);
    }

    lang.forEach(contents, function (row) {
      // 复制的字段大于已选择的单元格的个数
      // 将多余的空白符删除
      var hasSpace = true;
      while (row.length > num_x && hasSpace) {
        for (var start = row.length - 1; start >= 0; start--) {
          if (row[start].length === 0 &&
              whiteSpaceChar.test('' + row[start].charCodeAt(0))) {
            row.splice(start, 1);
            hasSpace = true;
            break;
          } else if (start === 0) {
            // 避免死循环
            hasSpace = false;
          }
        }
      }

      // 如果过滤一次之后还大于所选，直接截掉
      if (row.length > num_x) {
        row.splice(num_x);
      }
    });

    lang.log(num_x, num_y);

    return contents;
  },

  /**
   * 获取一个节点标识的 x,y 坐标
   * @param node
   * @returns {{x: *, y: *}}
   */
  getCoords: function (node) {
    var c = node.getAttribute('data-mark').split(':');
    return {x: lang.toInteger(c[0]), y: lang.toInteger(c[1])};
  },

  /**
   * 通过x,y的值获取一个 cell 对象
   * @param x
   * @param y
   * @returns {*}
   */
  getCellsWithCoords: function (x, y) {
    return this.cells[y][x];
  },

  /**
   * 选中鼠标拖动的区域的单元格，并将单元格中的值缓存到 `ZeroClipboardTarget` 对象上。
   * 用于可能存在的复制事件
   * @param coords
   * @returns {Marmoset.Component.BaseWebExcel}
   */
  focusSelectedCells: function (coords) {
    // 清除之前的选中
    this.blurSelectedCells(this.focusCells);

    this.focusCells = coords || this.computedRegion();

    if (!this.focusCells) {
      return this;
    }

    lang.forEach(this.focusCells, function (c, i) {
      this.getCellsWithCoords(c.x, c.y).onFocus();
    }, this);

    // agentTextArea 获得焦点
    this.agentTextArea.focus();

    this.zeroClipboardTarget.value =
        this.parseStringFromCopy(this.focusCells);

    this.emit('focusCells', this.focusCells);
  },

  /**
   * 解析复制而来的数据，拆成与表格对应的 Array
   * @param {Array|null} focusCells
   * @returns {string}
   */
  parseStringFromCopy: function (focusCells) {
    // 每一行结尾，添加 '\n\
    // 每一列结尾，添加 '\t'
    // focusCells 是先添加行上的单元格，再添加列上的单元格
    // 所以可以直接循环找列和行

    focusCells = focusCells || [];

    var pre_row = focusCells[0].y, pre_col = focusCells[0].x,
        focus_data = [], cell;

    lang.forEach(focusCells || [], function (coords) {

      cell = this.getCellsWithCoords(coords.x, coords.y);

      // 换行
      if (coords.y !== pre_row) {
        focus_data.push('\n');
      }
      // 换列
      if (coords.x !== pre_col) {
        focus_data.push('\t');
      }

      focus_data.push(cell.model[cell.name]);

      pre_row = coords.y;
      pre_col = coords.x;

    }, this);

    return focus_data.join('');
  },

  /**
   * 取消单元格的编辑状态
   * @param cells
   */
  blurSelectedCells: function (cells) {
    if (cells) {
      lang.forEach(cells, function (c) {
        this.getCellsWithCoords(c.x, c.y).onBlur();
      }, this);
    }
  },

  /**
   * 选中一列
   * @param x
   */
  focusOneColumn: function (x) {
    this.focusSelectedCells(this.getColumn(x));
  },

  /**
   * 选中一行
   * @param y
   */
  focusOneRow: function (y) {
    this.focusSelectedCells(this.getRows(y));
  },

  /**
   * 计算覆盖层的范围
   * @param focusCells
   * @returns {{start: {x: (boolean|Number|number), y: (boolean|Number|number)}, end: {x: *, y: *}}}
   */
  computedCoverRegion: function (focusCells) {
    var start = focusCells[0], end = focusCells[focusCells.length - 1];
    var startNode = this.cells[start.y][start.x].node;
    var endNode = this.cells[end.y][end.x].node;
    return {
      start: {
        x: startNode.offsetLeft,
        y: startNode.offsetTop
      },
      end: {
        x: endNode.offsetLeft + endNode.offsetWidth,
        y: endNode.offsetTop + endNode.offsetHeight
      }
    }
  },

  /**
   * 计算鼠标移动区域的单元格
   * @returns {Array}
   */
  computedRegion: function () {
    var cells = [];
    if (!(this.regionStart && this.regionEnd)) {
      return cells;
    }

    if (this.regionStart === this.regionEnd) {
      cells = [this.getCoords(this.regionStart)];
    }
    else {
      var start = this.getCoords(this.regionStart);
      var end = this.getCoords(this.regionEnd);

      var _start, _end;
      // 水平方向
      // 从左往右选
      if (start.x <= end.x) {
        _start = start.x;
        _end = end.x;
      } else {
        _start = end.x;
        _end = start.x;
      }

      // 垂直方向
      var __start, __end;
      // 从上往下选
      if (start.y <= end.y) {
        __start = start.y;
        __end = end.y;
      } else {
        __start = end.y;
        __end = start.y;
      }

      // x, y 轴的起始、结束坐标
      //lang.log([_start, _end], [__start, __end]);

      var _tempStart = __start;
      // 将已选中的元素添加选中状态
      // y 轴
      for (; __start <= __end; __start++) {
        // x 轴
        for (_tempStart = _start; _tempStart <= _end; _tempStart++) {
          cells.push({x: _tempStart, y: __start});
        }
      }

    }
    return cells;
  },

  /**
   * 单元格失去焦点时
   * @param input
   */
  cellOnBlur: function (input) {
    var coord = this.getCoords(input.parentNode.parentNode);
    this.getCellsWithCoords(coord.x, coord.y)
        .onBlur(input.value);
  },

  /**
   * 单元格获得焦点
   * @param node
   * @returns {Marmoset.Component.BaseWebExcel}
   */
  cellOnFocus: function (node) {
    var coords = this.getCoords(node);
    var cell = this.getCellsWithCoords(coords.x, coords.y);

    if (!cell) {
      return this;
    }

    if (!this.isInputFocusStatus) {
      this.agentTextArea.focus();
    }

    // 其他元素失去焦点
    this.blurSelectedCells(this.focusCells);
    // 当前元素获得焦点
    this.focusSelectedCells([coords]);
    this.focusCells = [coords];
  },

  /**
   * 编辑单元格
   * @param node
   */
  cellOnEdit: function (node) {
    var coord = this.getCoords(node);
    this.getCellsWithCoords(coord.x, coord.y)
        .onEdit();
  },

  /**
   * 获取某一行的单元格
   * @param index
   * @returns {*}
   */
  getRows: function (index) {
    return this.cells[index];
  },

  /**
   * 获取某一列的单元素
   * @param index
   * @returns {Array}
   */
  getColumn: function (index) {
    var column = [];
    lang.forEach(this.cells, function (rows) {
      column.push(rows[index]);
    });
    return column;
  }
});
