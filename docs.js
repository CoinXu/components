/**
 * Created by xcp on 2016/3/25.
 *
 * 读取一个目录下的所有.md文件，并将其转化为html
 */

var fs = require('fs');
var path = require('path');

var hljs = require('highlight');
var md = require('markdown-it')('commonmark', {
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
        if (lang) {
            try {
                return hljs.highlight(lang, str, true).value;
            } catch (e) {
            }
        }
        return '';
    }
});

var _addtionalHtml = function (title, body, iframeId) {
    return `<!doctype html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            <link rel="stylesheet" href="../../../assets/highlight/github.css">
            <link rel="stylesheet" href="../../../assets/github-markdown.css">
            <link rel="stylesheet" href="../../../assets/style.css">
            <script src="../../../assets/highlight/highlight.min.js"></script>
            <style>
                .markdown-body {box-sizing: border-box;min-width: 200px;max-width: 980px;margin: 0 auto;padding: 45px;}
            </style>
        </head>
        <body class="markdown-body">
            ${body}
        </body>
        <script>
            hljs.initHighlightingOnLoad();
            var body = document.body;
            var cssText = 'height:' + body.scrollHeight + 'px;';
            var iframe = window.parent.document.body.querySelector('#${iframeId}');
            if(iframe){
                iframe.style.cssText = cssText;
            }
        </script>
        </html>`;
};

function Parse(config) {
    this._defaultConfig = {
        basePath: process.cwd(),
        from: './components',
        to: './documents',
        type: '.md'
    };
    this._config = Object.assign(this._defaultConfig, config);
}

Parse.prototype.start = function () {
    this.read(path.join(this._config.basePath, this._config.from))
};

Parse.prototype.read = function (p) {
    var self = this;

    fs.stat(p, function (err, stats) {
        if (err) return;

        if (stats.isFile())
            self.readFile(p);

        if (stats.isDirectory())
            self.readDir(p);
    })
};

Parse.prototype.readFile = function (p) {
    if (!this.isMarkDown(p)) return;
    var toPath = this.getParseFilePath(p);
    var self = this;
    // 判断toPath是否存在
    self.mkdirs(toPath, function () {
        self.writeFile(p, toPath)
    });
};

Parse.prototype.mkdirs = function (toPath, callback) {
    // 目录只能一级一级的创建
    var sep = path.dirname(toPath).split(path.sep);
    var mode = parseInt('0777', 8);

    if (typeof callback !== 'function') {
        callback = function () {
        };
    }
    var __inner = function (cur) {
        if (!cur) cur = '/';
        var stats = null;
        try {
            stats = fs.statSync(cur);
        } catch (e) {
            fs.mkdirSync(cur, mode);
        }

        if (stats && !stats.isDirectory()) {
            fs.mkdirSync(cur, mode);
        }

        if (sep.length) {
            __inner(path.join(cur, sep.shift()))
        } else {
            callback()
        }
    };

    sep.length && __inner(sep.shift())
};

Parse.prototype.writeFile = function (from, to) {
    var reader = fs.createReadStream(from, 'utf8');
    var writer = fs.createWriteStream(to, 'utf8');
    var fileName = path.basename(from).replace(this._config.type, '');

    reader.on('data', function (chunk) {
        return writer.write(_addtionalHtml(fileName, md.render(chunk), fileName));
    });
};

Parse.prototype.getParseFilePath = function (p) {
    // 截取文件相对于根目录的目录
    var conf = this._config;
    var dir = p.replace(path.join(conf.basePath, conf.from), '');
    var dirname = path.dirname(dir);
    var basename = path.basename(dir, this._config.type);
    return path.join(conf.basePath, conf.to, dirname, '/' + basename + '.html');
};

Parse.prototype.readDir = function (p) {
    var self = this;

    fs.readdir(p, function (err, files) {
        if (err) {
            return console.log(err);
        }

        files.forEach(function (name) {
            self.read(path.join(p, name))
        })
    })
};

Parse.prototype.isMarkDown = function (p) {
    return this._config.type === path.extname(p);
};

//var args = process.argv.splice(2);
//var config = {};
//
//if(args[0]) {
//    config.from = args[0]
//}
//
//if(args[1]){
//    config.to = args[1]
//}

var parse = new Parse();
parse.start();