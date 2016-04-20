## 2016-04-20 —— xcp 
1. 改所有 `onVisible` 函数名为 `onHide`
2. 改变 `HideOnBodyClick` 的动画 `during` 参数的值为 `200`
3. 开放 `Popup` 的 `triggerHide` 配置参数，具体内容参考 `Popup` 文档
4. 由于第2点变化，所有的动画组件动画时间变化。涉及组件包括不限于：
   `Selectable` `DropDown` `Dialog` `Container` `Importable` `Different` `FirstOutContainer`
   `MiniContainer` 