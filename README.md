## 项目需要依赖 es6
建议 nodejs 升级到最新版本，旧版本的 nodejs 运行时，尝试加 --harmony 参数，如果依然失败... 请升级...

## Install dependencies
```bash
npm install
```

## Compile JSX
1. windows - `./compile.bat`
2. *unix - `./compile.sh`

## Make documents
```bash
webpack
node ./docs
```
## webpack 和 babel 需要全局安装
```bash 
npm install webpack -g
npm install babel -g
```

## 在浏览器上运行
```bash
compile.bat
```
之后，引入 /build/index.js 或 /build/index.min.js

## 需要在根目录创建 `lib` 目录，将 `react.js` 和 `react-dom.js` 放入其中，demo才能正常运行。




