import { JTimer } from "../../../Framework/Timers/JTimer";
import { formatString } from "../../../Framework/Utility/dx/formatString";
import BasePopup from "./BasePopup";
import { CNodePool } from "../../../Framework/Components/CNodePool";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { PlayerVO } from "../../VO/PlayerVO";
import { CDragonBones } from "../../../Framework/Components/CDragonBones";


const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("游戏模块/弹出模块/PopupGetReward")
export default class PopupGetReward extends BasePopup 
{
    public static ClassName:string = "PopupGetReward";
    public usePopupMask:boolean = false;
    private popupTween: cc.Tween = null;
    private itempool: CNodePool = null;
    public show(p: cc.Node, data?: any): void
    {
        if (this.node.parent == null)
            this.node.active = false;
        super.show(p, data);

        // 设置奖励
        this.setReward(data.list);
        // 弹出
        this.node.active = true;
        let n = this.node.getChildByName("node_content");
        let rewardAnim:dragonBones.ArmatureDisplay = getNodeChildByName(n,"rewardAnim",dragonBones.ArmatureDisplay);
        let player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        let aniName = player.isChinese ? "huodezhongwen":"huodeweiyu";
        CDragonBones.setDragonBones(rewardAnim,"DragonBones/Reward/huodejiemian_ske","DragonBones/Reward/huodejiemian_tex",
            "huodejiemian",aniName,1);
        this.popup(n, null);
    }
    protected onConfirmClick():void
    {
        let n = this.node.getChildByName("node_content");
        this.popdown(n, () => {
            this.clearReward();
            super.onConfirmClick();
        });
    }

    /**
     * 设置奖励
     * @param list
     */
    private setReward(list: {id:number,num:number}[]): void
    {
        // 获取节点
        let sv = cc.find("node_content/scrollview_items", this.node).getComponent(cc.ScrollView);
        let content = sv.content;
        if (!this.itempool)
        {
            let item = content.children[0];
            item.removeFromParent();
            item.active = true;
            this.itempool = new CNodePool(item);
        }

        // 开启关闭sv
        if (list.length > 5) 
        {
            sv.enabled = true;
            sv.scrollToRight();
        }
        else 
        {
            sv.enabled = false;
            content.x = 0;
        }
        // 设置item
        for (let i in list)
        {
            let item = this.itempool.Get();
            if (item && list[i])
            {
                // 设置纹理
                let sp = item.getChildByName("sprite_icon").getComponent(cc.Sprite);
                ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${list[i].id}`,sp);
                // 设置数量
                item.getChildByName("label_num").getComponent(cc.Label).string = "X" + list[i].num;
                // 添加
                content.addChild(item);
            }
        }
    }

    /**
     * 清理
     */
    private clearReward(): void
    {
        // 获取节点
        let sv = cc.find("node_content/scrollview_items", this.node).getComponent(cc.ScrollView);
        let content = sv.content;
        if (this.itempool)
        {
            this.itempool.PutArr(content.children);
        }
    }

	/**
	 * 弹出动画
	 * @param node 
	 * @param end 
	 */
	private popup(node: cc.Node, end: () => void):void
	{
		// 播放动画
		if (this.popupTween) this.popupTween.stop();
		this.popupTween = this.createTween(node, true)
						.call(() => {
							// 清空动画
							this.popupTween = null;
							// 执行结束回调
							if (end) end();
						})
						.start();
	}
	
	/**
	 * 弹下动画
	 * @param node 
	 * @param end 
	 */
	private popdown(node: cc.Node, end: () => void):void
	{
		// 播放动画
		if (this.popupTween) this.popupTween.stop();
		this.popupTween = this.createTween(node, false)
						.call(() => {
							// 清空动画
							this.popupTween = null;
							// 执行结束回调
							if (end) end();
						})
						.start();
	}

	/**
	 * 创建动画
	 * @param node 
	 * @param isOpen 
	 */
	private createTween(node: cc.Node, isOpen:boolean): cc.Tween
	{
		return cc.tween(node)
				.call(() => {
                    node.scale = isOpen ? 0 : 1;
                    node.opacity = isOpen ? 0 : 255;
				})
				.to(0.3, {scale:isOpen ? 1 : 0,opacity:isOpen ? 255 : 0}, {easing:isOpen ? "backOut" : "backIn"});
	}
}
