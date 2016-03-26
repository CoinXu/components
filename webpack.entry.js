/**
 * Created by xcp on 2016/3/12.
 */

"use strict";
const path = require('path');
const componentsBasePath = path.join(process.cwd(), './dist');

let _path = function (name) {
    return path.join(componentsBasePath, name, '/demo/index');
};

module.exports = {
    Animate: _path('Animate'),
    Conditional: _path('Conditional'),
    Popup: _path('Popup'),
    HideOnBodyClick: _path('HideOnBodyClick'),
    Message: _path('Message'),
    Selectable: _path('Selectable'),
    Pagination: _path('Pagination')
};
