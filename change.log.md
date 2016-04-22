## 2016-04-20 —— xcp 
1. 改所有 `onVisible` 函数名为 `onHide`
2. 改变 `HideOnBodyClick` 的动画 `during` 参数的值为 `200`
3. 开放 `Popup` 的 `triggerHide` 配置参数，具体内容参考 `Popup` 文档
4. 由于第2点变化，所有的动画组件动画时间变化。涉及组件包括不限于：
   `Selectable` `DropDown` `Dialog` `Container` `Importable` `Different` `FirstOutContainer`
   `MiniContainer` 
   
## 2016-04-22 —— xcp
1. DropDown 开放自定义弹层容器功能，详见文档`getItemWrap`方法
2. Selectable.Custom 开放自定义弹层容器功能，详见 `DropDown` 文档中 `getItemWrap`
3. Selectable.Custom 开放获取所有`item`函数，详见 `getItemsContent`
