/**
 * Created by xcp on 2016/3/15.
 */

module.exports = function (node) {
    var result = {x: 0, y: 0};
    var body = document.body || document.documentElement;

    if (!(node && node.nodeType === 1)) return result;

    var offsetLeft = node.offsetLeft;
    var offsetTop = node.offsetTop;

    var parent = node.offsetParent;
    if (!parent) return result;

    while (parent !== body) {
        offsetLeft += parent.offsetLeft;
        offsetTop += parent.offsetTop;
        parent = parent.offsetParent;
    }
    return {
        x: offsetLeft,
        y: offsetTop
    }
};
