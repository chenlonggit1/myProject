import { CNodePool } from "./CNodePool";
/**
 * 简易滑窗(用来处理一些简单的滑窗，降低drawcall，减少内存损耗)
 * 
 * 滑窗结构：svNode - mask - content - topSpring
 *                                  - list
 *                                  - bottomSpring
 * 
 * 注意事项：1.滑窗位置发生改变后都要对滑窗进行初始化InitSv
 *          2.滑窗初始化顺序是 BindNode -> BindItem -> BindData -> InitSv
 *          3.cn与list的anchorY = 0.5
 */
export class ScrollEasy {
    protected sv: cc.ScrollView = null // 滑窗
    protected cn: cc.Node = null // 滑窗content节点
    protected list: cc.Node = null // 滑窗list节点
    protected topSpring: cc.Node = null // 顶部弹簧节点
    protected bottomSpring: cc.Node = null // 底部弹簧节点
    protected itemTemplate: cc.Node | cc.Prefab = null // item模板
    protected itemPool: CNodePool = null // 对象池

    protected initItemCb: (item: cc.Node, data: any) => void = null // 初始化item的方法
    protected topCb: () => boolean = null // 滑到顶部回调
    protected btmCb: () => boolean = null // 滑到底部回调
    protected cbState: boolean = false // 回调状态，用来过滤重复调用顶部、底部回调
    protected maxCount: number = 0 // item最大个数
    protected spacing: number = 0 // item间隔
    protected cacheData: any[] = [] // 数据
    protected svBox: cc.Rect = null // 滑窗包围盒(世界)
    protected topIndex: number = 0 // 滑窗顶部数据索引
    protected bottomIndex: number = 0 // 滑窗底部数据索引
    protected cacheCount: number = 0 // 一边的缓存节点个数
    protected lastContentPosY: number = 0 // 上一次content的位置
    protected initRound: number = 0 // 初始化序号
    protected active: boolean = false // 列表状态

    /**
     * 绑定节点
     * @param sv 滚动列表
     * @param list list节点
     * @param top 顶部弹簧节点
     * @param bottom 底部弹簧节点
     * @return boolean 是否绑定成功
     */
    public BindNode(sv: cc.ScrollView, list: cc.Node, top: cc.Node, bottom: cc.Node): boolean {
        // 过滤无效参数
        if (!sv || !list || !top || !bottom) {
            return false
        }

        // 绑定节点
        this.sv = sv
        this.cn = this.sv.content
        this.list = list
        this.topSpring = top
        this.bottomSpring = bottom

        // 获取间隔
        let listLayout = this.list.getComponent(cc.Layout)
        if (listLayout) {
            this.spacing = listLayout.spacingY
        }

        // 设置anthorY
        this.cn.anchorY = 0.5
        this.list.anchorY = 0.5

        // 添加监听
        this.addListen()

        // 列表激活
        this.active = true

        return true
    }

    /**
     * 绑定item
     * @param item item实例或预制体
     * @param count 滑窗的所能显示的item数量
     * @param cb 初始话item回调
     * @return boolean 是否绑定成功
     */
    public BindItem(item: cc.Node | cc.Prefab, count: number, cb: (item: cc.Node, data: any) => void): boolean {
        // 过滤无效参数
        if (!item || !(count === +count) || count <= 0 || !cb) {
            return false
        }

        this.itemTemplate = item

        // 创建对象池
        this.itemPool = new CNodePool(this.itemTemplate)

        // 最大个数
        this.maxCount = count * 2
        // 一边的缓存节点个数
        this.cacheCount = Math.floor(count / 2)
        // 初始化tiem的方法
        this.initItemCb = cb
        // 计算滑窗包围盒(世界)
        this.svBox = this.getBoxToWorld(this.sv.node)

        return true
    }

    /**
     * 绑定顶部和底部的回调
     * @param topcb 顶部回调
     * @param btmcb 底部回调
     */
    public BindTopBtmCb(topcb: () => boolean, btmcb: () => boolean): void {
        // 顶部
        if (topcb) {
            this.topCb = topcb
        }
        // 底部
        if (btmcb) {
            this.btmCb = btmcb
        }
    }

    /**
     * 绑定数据
     * @param datas 数据列表
     */
    public BindData(datas: any[]): boolean {
        // 过滤无效参数
        if (!datas) {
            return false
        }

        // 设置数据
        this.cacheData = datas
        // 重置回调状态
        this.cbState = false
        // 设置初始化序号
        this.initRound++
        if (this.initRound > 0xFFFFFFFF) {
            this.initRound = 0
        }

        return true
    }

    /**
     * 初始化滑窗
     * 根据索引值显示对应位置
     * @param index 起始位置
     */
    public InitSv(index: number = 0) {
        // 过滤无效参数
        if (!(index === +index) || index < 0 || !this.sv || !this.cacheData || !this.itemPool ||
            !this.list || !this.cn || !this.topSpring || !this.bottomSpring || !this.active) {
            return
        }

        // sv节点上存在widget组件时，先执行widget对齐
        let widget = this.sv.node.getComponent(cc.Widget)
        if (widget) {
            widget.updateAlignment()
        }

        // 清空列表
        this.itemPool.PutArr(this.list.children)

        // layout
        let lyCn = this.cn.getComponent(cc.Layout)
        let lyList = this.list.getComponent(cc.Layout)

        // 数据为空
        if (this.cacheData.length <= 0) {
            return
        }

        // 修正
        let fixIndex = Math.max(0, Math.min(this.cacheData.length - this.maxCount, index))
        let showIndex = Math.max(0, Math.min(this.cacheData.length - this.maxCount / 2, index))

        // 停止滑动
        this.sv.stopAutoScroll()

        // 计算滑窗包围盒(世界)
        this.svBox = this.getBoxToWorld(this.sv.node)
        // 节点个数
        let itemCount = Math.min(this.cacheData.length, this.maxCount)
        // 设置索引
        this.topIndex = fixIndex
        this.bottomIndex = fixIndex + itemCount - 1
        // 偏移值
        let offsetY = 0

        let num = this.topIndex

        // 构造添加完毕函数
        let addComplete = () => {
            // 重置弹簧高度
            this.topSpring.height = 0
            this.bottomSpring.height = 0

            // 主动更新layout
            lyList.updateLayout()
            lyCn.updateLayout()

            // 移动到指定位置
            this.sv.scrollToOffset(cc.v2(0, offsetY))

            // 隐藏超出滑窗范围的item
            this.hideOutItem()
        }

        // 构造添加节点函数
        let addItem = (round: number) => {
            // 结束当前初始化
            if (round != this.initRound || !this.active) {
                return
            }

            // 获取节点
            let item = this.itemPool.Get()
            // 设置item
            this.setItem(item, this.cacheData[num])
            // 添加
            if (!item.parent) {
                this.list.addChild(item)
            }

            // 计算偏移值
            if (num < showIndex) {
                offsetY += item.height + this.spacing
            }

            num++
            this.topSpring.height += item.height + this.spacing

            // 添加完毕
            if (num > this.bottomIndex) {
                addComplete()
                return
            }

            // 节点池有节点，直接执行
            addItem(round)
        }

        // 执行
        addItem(this.initRound)
    }

    /**
     * 更新数据
     * 添加或修改
     * @param index 数据索引
     * @param datas 数据列表
     */
    public UpdateData(index: number, datas: string[]) {
        // 过滤无效参数
        if (!(index === +index) || !datas || !this.itemPool || !this.list || !this.svBox ||
            !this.cacheData || !this.cn || !this.topSpring || !this.bottomSpring) {
            return
        }

        // 设置数据
        for (let i = 0; i < datas.length; i++) {
            if (index + i > this.cacheData.length - 1) {
                this.cacheData.push(datas[i])
            }
            else {
                this.cacheData[index + i] = datas[i]
            }
        }
    }

    /**
     * 更新滑窗
     * 仅限于修改前后item节点的数量和高度不变的情况下使用，其余情况用initSv
     */
    public UpdateSv() {
        // 过滤无效参数
        if (!this.list || !this.cacheData || !this.active) {
            return
        }

        // 更新
        for (let i = 0; i < this.list.childrenCount; i++) {
            // 获取节点
            let item = this.list.children[i]
            // 设置item
            this.setItem(item, this.cacheData[i + this.topIndex])
        }
    }

    /**清理 */
    public Clear() {
        // 移除监听
        this.removeListen()

        // 节点
        this.sv = null
        this.cn = null
        this.list = null
        this.topSpring = null
        this.bottomSpring = null

        // item
        this.itemTemplate = null
        if (this.itemPool) {
            this.itemPool.Destroy()
        }

        // 其他数据
        this.spacing = 0
        this.svBox = null
        this.maxCount = 0
        this.cacheData = []
        this.topIndex = 0
        this.bottomIndex = 0
        this.cacheCount = 0
        this.lastContentPosY = 0
        this.active = false
    }

    /**
     * 是否数据量足够
     * 初始化列表的时候填充数据时判断数据量是否满足,只有需要上滑加载的列表才会用到
     * @return boolean 是否数据量足够
     */
    public IsDataEnough(): boolean {
        return this.cacheData.length >= this.maxCount
    }

    /**
     * 是否可以更新数据
     * @param cnt 数据长度
     * @return boolean 是否可以更新数据
     */
    public CanUpdate(cnt: number): boolean {
        return this.IsDataEnough() && this.cacheData.length <= cnt
    }

    /**添加监听 */
    protected addListen() {
        if (this.sv && this.sv.node) {
            this.sv.node.on('scrolling', this.onScrolling.bind(this), this)
        }
    }

    /**移除监听 */
    protected removeListen() {
        if (this.sv && this.sv.node) {
            this.sv.node.off('scrolling', this.onScrolling.bind(this), this)
        }
    }

    /**
     * 设置item
     * @param item 节点
     * @param data 数据
     */
    protected setItem(item: cc.Node, data: any) {
        if (this.initItemCb) {
            this.initItemCb(item, data)
        }
    }

    /**滑动 */
    protected onScrolling() {
        // 过滤无效参数
        if (!this.sv || !this.cacheData || !this.itemPool || !this.list || this.list.childrenCount <= 0 ||
            !this.svBox || !this.cn || !this.topSpring || !this.bottomSpring || !this.active) {
            return
        }

        // 方向(false: 向下，true: 向上)
        let dir = true
        if (this.lastContentPosY > this.cn.y) {
            dir = false
        }
        this.lastContentPosY = this.cn.y

        // 节点不足，过滤
        if (this.list.childrenCount <= this.cacheCount) {
            return
        }

        let moveCount = Math.floor(this.cacheCount / 2)
        let topItem = this.list.children[moveCount]
        let bottomItem = this.list.children[this.list.childrenCount - moveCount - 1]

        // 上滑
        if (dir) {
            let bottomBox = this.getBoxToWorld(bottomItem)

            if (bottomBox.intersects(this.svBox)) {
                for (let i = 0; i < moveCount; i++) {
                    if (this.bottomIndex < this.cacheData.length - 1) {
                        this.bottomIndex++
                        // 创建节点
                        let newItem = this.itemPool.Get()
                        this.setItem(newItem, this.cacheData[this.bottomIndex])
                        // 添加新节点
                        this.list.addChild(newItem)
                        // 底部弹簧减少
                        let delY = newItem.height + this.spacing
                        let lastH = this.bottomSpring.height
                        this.bottomSpring.height = this.bottomIndex == this.cacheData.length - 1 ? 0 : Math.max(0, this.bottomSpring.height - delY)

                        this.topIndex++
                        // 回收旧节点
                        let oldItem = this.list.children[0]
                        this.itemPool.Put(oldItem)
                        // 顶部弹簧增加
                        let addY = oldItem.height + this.spacing
                        this.topSpring.height += addY

                        // 修正
                        let disH = lastH - this.bottomSpring.height
                        let disY = delY - disH
                        if (disY > 0) {
                            this.topSpring.height += disY
                        } else {
                            if (this.topSpring.height + disY > 0) {
                                this.topSpring.height += disY
                            } else {
                                this.cn.y += this.topSpring.height + disY
                                this.topSpring.height = 0
                            }
                        }
                    }
                }
            }
        } else { // 下滑
            let topBox = this.getBoxToWorld(topItem)

            if (topBox.intersects(this.svBox)) {
                for (let i = 0; i < moveCount; i++) {
                    if (this.topIndex > 0) {
                        this.topIndex--
                        // 创建节点
                        let newItem = this.itemPool.Get()
                        this.setItem(newItem, this.cacheData[this.topIndex])
                        // 插入新节点
                        this.list.insertChild(newItem, 0)
                        // 顶部弹簧减少
                        let delY = newItem.height + this.spacing
                        let lastH = this.topSpring.height
                        this.topSpring.height = this.topIndex == 0 ? 0 : Math.max(0, this.topSpring.height - delY)

                        this.bottomIndex--
                        // 回收旧节点
                        let oldItem = this.list.children[this.list.children.length - 1]
                        this.itemPool.Put(oldItem)
                        // 底部弹簧增加
                        let addY = oldItem.height + this.spacing
                        this.bottomSpring.height += addY

                        // 修正
                        let disH = lastH - this.topSpring.height
                        let disY = delY - disH
                        if (disY > 0) {
                            this.bottomSpring.height += disY
                        } else {
                            if (this.bottomSpring.height + disY > 0) {
                                this.bottomSpring.height += disY
                            } else {
                                this.cn.y += this.bottomSpring.height + disY
                                this.bottomSpring.height = 0
                            }
                        }
                    }
                }
            }
        }

        if (!this.cbState) {
            // 滑动到顶部
            if (this.topCb && this.topIndex == 0) {
                this.cbState = this.topCb()
            }
            // 滑动到底部
            if (this.btmCb && this.bottomIndex == this.cacheData.length - 1) {
                this.cbState = this.btmCb()
            }
        }

        // 隐藏超出滑窗范围的item
        this.hideOutItem()
    }

    /**隐藏超出滑窗范围的item */
    protected hideOutItem() {
        // 过滤无效参数
        if (!this.list || this.list.childrenCount <= 0 ||
            !this.svBox || !this.active) {
            return
        }

        // 遍历cn
        for (let i = 0; i < this.list.childrenCount; i++) {
            // 获取子节点
            let child = this.list.children[i]
            if (!child) {
                continue
            }

            // 判断两矩形是否相交
            if (this.svBox.intersects(this.getBoxToWorld(child))) { // 相交，显示节点
                child.opacity = 255
            } else { // 不相交，隐藏节点
                child.opacity = 0
            }
        }
    }

    /**
     * 返回节点在世界坐标系下的对齐轴向的包围盒（AABB）
     * @param node 节点
     * @return cc.Rect 包围盒
     */
    protected getBoxToWorld(node: cc.Node): cc.Rect {
        // 盒子左下角世界坐标
        let wPos = node.parent.convertToWorldSpaceAR(cc.v2(
            node.x - node.anchorX * node.width,
            node.y - node.anchorY * node.height,
        ))

        // 盒子
        let box = new cc.Rect(wPos.x, wPos.y, node.width, node.height)

        return box
    }
}