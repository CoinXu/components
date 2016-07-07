/**
 * @class Marmoset.core.dom.dom
 * @requires Marmoset.lang
 * ## 简单的DOM操作和创建
 */

var lang = require('./lang');


var doc = document;

var HTMLElements = {
  // 所有HTML elements
  /**
   * @property
   * 可创建的合法的HTML：
   * http://www.w3.org/TR/html-markup/elements.html
   *
   *      ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio',
   *      'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button',
   *      'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'command',
   *      'datalist', 'dd', 'del', 'details', 'dfn', 'div', 'dl', 'dt',
   *      'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form',
   *      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html',
   *      'i', 'iframe', 'img', 'input', 'ins',
   *      'kbd', 'keygen',
   *      'label', 'legend', 'li', 'link',
   *      'map', 'mark', 'menu', 'meta', 'meter',
   *      'nav', 'noscript',
   *      'object', 'ol', 'optgroup', 'option', 'output',
   *      'p', 'param', 'pre', 'progress',
   *      'q',
   *      'rp', 'rt', 'ruby', 's',
   *      'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup',
   *      'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track',
   *      'u', 'ul',
   *      'var', 'video',
   *      'wbr']
   *
   * @type {string[]}
   */
  tags: [
    'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio',
    'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button',
    'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'command',
    'datalist', 'dd', 'del', 'details', 'dfn', 'div', 'dl', 'dt',
    'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html',
    'i', 'iframe', 'img', 'input', 'ins',
    'kbd', 'keygen',
    'label', 'legend', 'li', 'link',
    'map', 'mark', 'menu', 'meta', 'meter',
    'nav', 'noscript',
    'object', 'ol', 'optgroup', 'option', 'output',
    'p', 'param', 'pre', 'progress',
    'q',
    'rp', 'rt', 'ruby',
    's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup',
    'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track',
    'u', 'ul',
    'var', 'video',
    'wbr'
  ],

  /**
   * @property
   * 省略闭合标识的标签，标签内不许有子节点
   */
  omittedCloseTags: {
    area: true,
    base: true, br: true,
    col: true,
    embed: true,
    hr: true,
    img: true, input: true,
    keygen: true,
    link: true,
    meta: true,
    param: true,
    source: true,
    track: true,
    wbr: true
  },

  /**
   * @property
   * 属性值，通过 element.{property} 来调用
   */
  property: {
    accessKey: true,
    align: true,
    className: true,
    clientHeight: true,
    clientLeft: true,
    clientTop: true,
    clientWidth: true,
    dir: true,
    hidden: true,
    id: true,
    innerHTML: true,
    innerText: true,
    lang: true,
    offsetHeight: true,
    offsetLeft: true,
    offsetParent: true,
    offsetTop: true,
    offsetWidth: true,
    outerHTML: true,
    outerText: true,
    scrollHeight: true,
    scrollLeft: true,
    scrollTop: true,
    scrollWidth: true,
    tabIndex: true,
    title: true,
    translate: true
  },

  /**
   * @property
   * nodeType
   */
  NODE_TYPE: {
    ELEMENT_NODE: 1,
    ATTRIBUTE_NODE: 2,
    TEXT_NODE: 3,
    CDATA_SECTION_NODE: 4,
    ENTITY_REFERENCE_NODE: 5,
    ENTITY_NODE: 6,
    PROCESSING_INSTRUCTION_NODE: 7,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
    NOTATION_NODE: 12
  },

  /**
   * 可作为子元素的nodeType
   */
  CHILDREN_TYPE: {
    1: true,
    3: true,
    4: true,
    8: true
  }
};

var DOM = {};

/**
 * 判断是否是一个节点
 * @param node
 * @returns {boolean}
 * @private
 */
function _isNode(node) {
  return node && node.nodeType;
}

/**
 * 能否作为一个父节点
 * @param node
 * @returns {boolean}
 * @private
 */
function _becomingParent(node) {
  return _isNode(node) && node.nodeType ===
      HTMLElements.NODE_TYPE.ELEMENT_NODE && !HTMLElements.omittedCloseTags[node.nodeName.toLowerCase()];
}

/**
 * 能否作为一个子节点
 * @param node
 * @returns {boolean|*}
 * @private
 */
function _becomingChild(node) {
  return _isNode(node) &&
      HTMLElements.CHILDREN_TYPE[node.nodeType];
}

/**
 * 添加子节点
 * @param node
 * @param childrenList
 * @returns {*}
 * @private
 */
function _appendChildren(node, childrenList) {

  if (!_becomingParent(node)) {
    lang.error('can not append child node in this node');
  }

  lang.forEach(childrenList, function (child) {
    if (_becomingChild(child)) {
      node.appendChild(child);
    }
  });

  return node;
}

/**
 * 创建一个节点
 * @param type
 * @param props
 * @param children
 * @returns {Element}
 * @private
 */

function _createElement(type, props, children) {

  if (!lang.isString(type)) {
    lang.error('HTMLElements type must string. not [' + lang.objectType(type) + ']');
  }

  var node = doc.createElement(type);

  if (props && lang.isObject(props)) {
    _attr(node, props);
  }

  if (children) {
    _appendChildren(node, lang.isArray(children) ? children : [children]);
  }
  return node;
}

/**
 * 设置节点的属性
 * @param node
 * @param attributes
 * @private
 */
function _attr(node, attributes) {
  lang.each(attributes, function (val, prop) {
    // todo 旧版浏览器中table/tr之类的元素，无法直接设置innerHTML
    try {
      if (HTMLElements.property[prop]) {
        node[prop] = val;
      } else {
        node.setAttribute(prop, val);
      }
    } catch (e) {
      throw e;
    }
  });
}

lang.forEach(HTMLElements.tags, function (type) {
  DOM[type] = function (props, children) {
    return _createElement(type, props, children);
  };
});

DOM.text = function (data) {
  return doc.createTextNode(data);
};

module.exports = {
  /**
   * 添加 class
   * @param name
   * @returns {Marmoset.core.dom.dom}
   */
  addClass: function (name) {
    if (this.hasClass(name)) {
      return this;
    }
    var node = this[0];
    if (node.classList) {
      node.classList.add(name);
    }
    else {
      node.className += ' ' + name;
    }

    return this;
  },

  /**
   * 是否有 class
   * @param name
   * @returns {boolean}
   */
  hasClass: function (name) {
    var node = this[0];
    return node.classList ?
        node.classList.contains(name) :
    node.className.indexOf(name) !== -1;
  },

  /**
   * 移除 class
   * @param name
   * @returns {Marmoset.core.dom.dom}
   */
  removeClass: function (name) {
    if (!this.hasClass(name)) {
      return this;
    }
    var node = this[0];
    if (node.classList) {
      node.classList.remove(name);
    } else {
      var c = node.className;
      c = c.split(/\s+/);
      var index = lang.indexOf(c, name);
      c = c.splice(index, 1);
      node.className = c.join(' ');
    }
    return this;
  },

  /**
   * 清空一个dom
   * @returns {Marmoset.core.dom.dom}
   */
  empty: function () {
    try {
      this[0].innerHTML = '';
    } catch (e) {
    }
    return this;
  },

  /**
   * 设置属性
   * @param options
   * @returns {Marmoset.core.dom.dom}
   */
  attr: function (options) {
    _attr(this[0], options);
    return this;
  },

  html: function () {
    if (arguments.length) {
      _attr(this[0], {innerHTML: [].slice.call(arguments).join('')})
    } else {
      return this[0].innerHTML;
    }
  },

  /**
   * @property
   * 创建DOM对象，如果要在服务器上静态化js模版。
   * 就需要一套在服务上也能运行的DOM，也就是React提出的虚拟DOM（virtual DOM）。
   *
   * 包含 {@link Marmoset.dom#property-HTMLElements HTMLElements} 中的所有标签。
   * ## 调用方式:
   *
   *      @example
   *      dom.DOM.div({
         *        className: 'biu',
         *        style: 'color:red',
         *        innerText: 'biubiubiu'
         *      })
   *
   * @type {Object}
   */
  DOM: DOM,

  createElement: _createElement
};
