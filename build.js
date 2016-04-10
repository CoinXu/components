/**
 * Created by xcp on 2016/4/6.
 */

var fs = require('fs');
var path = require('path');

var exportsFunctionString = function (libraryName, funcBody) {
    return `(function (f) {if (typeof exports === "object" && typeof module !== "undefined") {module.exports = f(require('${libraryName}'));} else if (typeof define === "function" && define.amd) {define(['${libraryName}'], f());} else {var g;if (typeof window !== "undefined") {g = window;} else if (typeof global !== "undefined") {g = global;} else if (typeof self !== "undefined") {g = self;} else {g = this;}g.${libraryName} = f();}})(function () {return ${funcBody}});`;
};

var libraryName = 'Essa';

for (var i = 0, files = ['./build/index.webpack.js', './build/index.webpack.min.js']; i < files.length; i++) {
    var data = fs.readFileSync(files[i], 'utf8');
    var write = fs.createWriteStream(files[i].replace('.webpack', ''), 'utf8');
    write.write(exportsFunctionString(libraryName, data, files[i].indexOf('min') !== -1))
}








