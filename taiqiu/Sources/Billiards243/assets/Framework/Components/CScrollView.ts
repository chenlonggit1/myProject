import { CNodePool } from "./CNodePool";
import { ScrollEasy } from "./ScrollEasy";

const { ccclass, property, inspector, menu, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
@menu('Components/基础组件/CScrollView')
// @inspector("packages://inspector/inspectors/comps/scrollview.js")
export class CScrollView extends cc.ScrollView {
    public static ClassName: string = "CScrollView";

    // 是否使用简易滑窗功能
    @property({ visible: false })
    private _useScrollEasy: boolean = false;
    @property({
        displayName: "是否使用简易滑窗功能",
        tooltip: "目前仅支持垂直滑窗",
        type: cc.Boolean,
    })
    public get useScrollEasy(): boolean {
        return this._useScrollEasy;
    }
    public set useScrollEasy(ok: boolean) {
        this._useScrollEasy = ok;
        this.autoCreateSv();
    }

    private _scrollEasy: ScrollEasy = null; // 简易滑窗辅助工具
    public get scrollEasy(): ScrollEasy {
        return this._scrollEasy;
    }

    onDestroy() {
        // 清理简易滑窗工具
        if (this._scrollEasy) this._scrollEasy.Clear();
    }

    /**自动创建滑窗所需的节点 */
    private autoCreateSv() {
        // 仅在编译器内调用
        if (!CC_EDITOR || !this.useScrollEasy) return;

        // MaskView
        let maskview = cc.find("mask_view", this.node);
        if (!maskview) {
            // 添加节点
            maskview = new cc.Node("mask_view");
            this.node.addChild(maskview);

            // Mask组件
            let mask = maskview.addComponent(cc.Mask);
            mask.type = cc.Mask.Type.RECT;

            // Widget组件
            let widget = maskview.addComponent(cc.Widget);
            widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
            [widget.isAlignTop, widget.isAlignBottom, widget.isAlignLeft, widget.isAlignRight] = [true, true, true, true];
            [widget.top, widget.bottom, widget.left, widget.right] = [0, 0, 0, 0];
        }

        // LayoutContent
        let layoutcontent = cc.find("layout_content", maskview);
        if (!layoutcontent) {
            // 添加节点
            layoutcontent = new cc.Node("layout_content");
            maskview.addChild(layoutcontent);

            // Layout组件
            let layout = layoutcontent.addComponent(cc.Layout);
            layout.type = cc.Layout.Type.VERTICAL;
            layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;

            // Widget组件
            let widget = layoutcontent.addComponent(cc.Widget);
            widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
            [widget.isAlignLeft, widget.isAlignRight] = [true, true];
            [widget.left, widget.right] = [0, 0];
        }

        // SpringTop
        let springtop = cc.find("spring_top", layoutcontent);
        if (!springtop) {
            // 添加节点
            springtop = new cc.Node("spring_top");
            layoutcontent.addChild(springtop);
        }

        // LayoutList
        let layoutlist = cc.find("layout_list", layoutcontent);
        if (!layoutlist) {
            // 添加节点
            layoutlist = new cc.Node("layout_list");
            layoutcontent.addChild(layoutlist);

            // Layout组件
            let layout = layoutlist.addComponent(cc.Layout);
            layout.type = cc.Layout.Type.VERTICAL;
            layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;

            // Widget组件
            let widget = layoutlist.addComponent(cc.Widget);
            widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
            [widget.isAlignLeft, widget.isAlignRight] = [true, true];
            [widget.left, widget.right] = [0, 0];
        }

        // SpringBottom
        let springbottom = cc.find("spring_bottom", layoutcontent);
        if (!springbottom) {
            // 添加节点
            springbottom = new cc.Node("spring_bottom");
            layoutcontent.addChild(springbottom);
        }

        // 绑定滑窗的Content
        this.content = layoutcontent;
        // 设置滑窗属性
        this.horizontal = false;
        this.brake = 0.75;
        this.bounceDuration = 0.23;
        // 调整Content下节点的顺序
        [springtop.zIndex, layoutlist.zIndex, springbottom.zIndex] = [0, 1, 2];
    }

    /**绑定简易滑窗 */
    public bindScrollEasy() {
        let springtop = cc.find("spring_top", this.content);
        let layoutlist = cc.find("layout_list", this.content);
        let springbottom = cc.find("spring_bottom", this.content);

        // 创建辅助工具
        this._scrollEasy = new ScrollEasy();
        this._scrollEasy.BindNode(this, layoutlist, springtop, springbottom);
    }
}


