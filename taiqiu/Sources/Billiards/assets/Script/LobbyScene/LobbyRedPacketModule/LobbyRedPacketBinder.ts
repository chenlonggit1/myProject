import { FBinder } from "../../../Framework/Core/FBinder";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { SimpleRedPacketVO } from "../../VO/SimpleRedPacketVO";
import { C_Lobby_DrawLottery } from "../../Networks/Clients/RedPacket/C_Lobby_DrawLottery";
import { getLang } from "../../../Framework/Utility/dx/getLang";
import { CScrollView } from "../../../Framework/Components/CScrollView";
import { ScrollEasy } from "../../../Framework/Components/ScrollEasy";

/**
*@description:红包墙
**/
export class LobbyRedPacketBinder extends FBinder 
{
	public static ClassName:string = "LobbyRedPacketBinder";

	private btnClose:cc.Node = null;
	private btnComfirm:cc.Node = null;
	private sv:CScrollView = null;
	private svTool:ScrollEasy = null;
	private datas:SimpleRedPacketVO[] = [];
	
	protected initViews(): void 
	{
		super.initViews();
		super.addEvents();

		// 注册按钮点击事件
		this.btnClose = getNodeChildByName(this.asset, "CloseBtn");
		this.btnClose.on("click", () => {
			dispatchModuleEvent(ModuleEvent.HIDE_MODULE,ModuleNames.Lobby_RedPacket);
		})
		this.btnComfirm = getNodeChildByName(this.asset, "ComfirmBtn");
		this.btnComfirm.on("click", () => {
			dispatchModuleEvent(ModuleEvent.HIDE_MODULE,ModuleNames.Lobby_RedPacket);
		})
		// TEST:抽奖测试按钮
		let CD = Date.now()
		let btnTest: cc.Node = getNodeChildByName(this.asset, "TestBtn");
		btnTest.on("click", () => {
			// 防止快速连续点击
			let now = Date.now()
			if (now - CD < 1000) {
				return
			}
			CD = now
			C_Lobby_DrawLottery.Send(Math.floor(Math.random() * 4 + 1))
		})
		// 绑定滑窗
		this.bindSv()
	}
	public update(data: {adds: SimpleRedPacketVO[], animEnd: boolean})
	{
		// 更新数据
		if (data.adds) this.datas = this.datas.concat(data.adds);
		// 动画未结束，直接返回
		if (!data.animEnd) return;
		// 绑定数据
		this.svTool.BindData(this.datas);
		// 初始化滑窗
		this.svTool.InitSv(this.datas.length);
	}
	public dispose() 
	{
		super.dispose();
	}
	private bindSv()
	{
		// 绑定简易滑窗
		this.sv = getNodeChildByName(this.asset, "ScrollView").getComponent(CScrollView);
		this.sv.bindScrollEasy();
		this.svTool = this.sv.scrollEasy;
		// 移除item
		let svItem = cc.find("layout_list/Item", this.sv.content);
        svItem.removeFromParent();
		svItem.active = true;
		// 绑定item
		this.svTool.BindItem(svItem, 5, this.setSvItem.bind(this));
	}
	private setSvItem(item: cc.Node, data: SimpleRedPacketVO)
    {
		// 过滤
		if (!item || !data) return;
		// 红包券，玩家昵称
        let richText = cc.find("Layout/RichText", item).getComponent(cc.RichText);
        richText.string = ` ${getLang("Text_hbjuan")} ${getLang("Text_Obtain")} <color=#FCCF64><size=30>${data.num}</s></c>  <color=#FFD264>${data.nick}</c> ${getLang("Text_player")} `;
		// VIP
        let vip = cc.find("Layout/VIP", item).getComponent(cc.Label);
        vip.string = `VIP${data.vip}`;
		// 时间
		let time = cc.find("Label_Time", item).getComponent(cc.Label);
		let date = new Date(data.time);
		time.string = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}      ${date.getHours()}:${date.getMinutes()}`;
		
    }
}