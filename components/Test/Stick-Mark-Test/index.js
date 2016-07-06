/**
 * Created by xcp on 7/6/16.
 */

const excel_parent = document.getElementById('base-web-excel');
const header_parent = document.getElementById('excel-header');
const StickMark = require('./StickMark');
const Data = require('./scripts/model/index').model;

const stickMark = window.stickMark =
    new StickMark(excel_parent, header_parent, Data);

stickMark.render();