/**
 * Created by xcp on 2016/5/5.
 * 设计目标
 * 1. 每一个节点的内容可以自定义
 * 2. 支持叶子节点
 * 3. 展开、收缩
 * 4. 默认选中某一个，选中的目标自定义样式
 * 5. 生成子父集、兄弟集map，以便多选时判断
 *
 * 实现思路
 * 1. props 接受 getItem(level, state, props, inst) 函数
 * 2. 每一个节点为一个单独的 React.Component，使用 isLeaf 属性确定其是否是叶子节点。
 *    并开放 leafNodeClass 自定义叶子节点样式
 * 3. 用 Animate 包裹每一个父级，这样的话，父级最好是一个单独的 React.Component，可命名为
 *    TreeNodeGroup
 * 4. props 接受两个属性 defaultValue 和 currentItemClass
 * 5. 需要将所有的数据 flatten 之后，生成多个 map，这里最好需要一个单独的处理数据的 Model
 *
 * 代码设计
 * 1. <TreeNode isLeaf={Boolean} getItem={getItem} level={Integer}>{children}</TreeNode>
 * 2. <TreeNodeGroup collapse={Boolean}>
 *      <TreeNode/>
 *      <TreeNode/>
 *    </TreeNodeGroup>
 * 3. <Tree selectable={Boolean}>
 *      <TreeNodeGroup/>
 *      <TreeNodeGroup/>
 *    </Tree>
 *
 * 衍化
 * TreeNodeGroup 可以直接用 TreeNode 代替。
 * TreeNode 本身可以包含 TreeNode
 * <Tree selectable={Boolean} collapseAll={Boolean} defaultCollapse={item}>
 *   <TreeNode collapse={Boolean}>
 *     <TreeNode isLeaf={Boolean} getItem={getItem} level={Integer} value={item}/>
 *     <TreeNode>
 *        <h2>title</h2>
 *     </TreeNode>
 *   </TreeNode>
 * </Tree>
 */




