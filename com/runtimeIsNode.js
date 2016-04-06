/**
 * Created by xcp on 2016/3/30.
 */

module.exports = function () {
    var result = false;
    try {
        result = window;
    } catch (e) {
    }

    return !result;
};