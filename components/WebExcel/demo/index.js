/**
 * Created by xcp on 2016/4/12.
 */

const excel_parent = document.getElementById('base-web-excel');
const StickMark = require('./stick-mark');
const Data = require('../model').model;

const stickMark = window.stickMark = new StickMark(excel_parent, Data);
stickMark.render();




