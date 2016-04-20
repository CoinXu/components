```javascript
/**
 * 定义接口
 * @spread: Boolean 是否展开列表 可选
 * @selectList：Array 展开列表的内容 必要
 * @placeholder：string 占位字符串 可选
 * @isPlaceholderStyle: true 是否淡化占位符的样式 可选
 * @form  Object对象 表单DOM对象 需要对该组件验证时时必要的，不需要验证组件则不需要传入
 * @classname object 必须
 * @tips string 提示内容
 * @type {{selectList: string[], placeholder: string, spread: boolean, form: Element, tips: string
 */
var selectConfig = {
    selectList: ['合作方式A', '合作方式B', '合作方式C', '合作方式D'],
    placeholder: '合作方式',
    form: document.getElementById('myForm'),
    tips: '请选择合作方式',
    classnames: classNames({
        box: true,
        'height-in-sl': true,
        'w-266': true
    })

};
ReactDOM.render(
    <SelectBox {...selectConfig}/>,
    document.getElementById('selelctBox')
);
```
