import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { C_Lobby_MemberAward } from "../../Networks/Clients/Member/C_Lobby_MemberAward";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { PlayerVO } from "../../VO/PlayerVO";
import { CNodePool } from "../../../Framework/Components/CNodePool";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { SimpleMemberConfigVO } from "../../VO/SimpleMemberConfigVO";
import { MemberConfigVO } from "../../VO/MemberConfigVO";
import { CLanguage } from "../../../Framework/Components/CLanguage";
import { getLang } from "../../../Framework/Utility/dx/getLang";

/**
*@description:会员详情
**/
export class LobbyMemberInfoBinder extends FBinder 
{
	public static ClassName:string = "LobbyMemberInfoBinder";

    private lbTitle:cc.Label = null;
    private lbContent:cc.Label = null;
    private layReward:cc.Node = null;
    private btnGet:CLanguage = null;
    private pool:CNodePool = null;
    private player:PlayerVO = null;
    private simpleMember:SimpleMemberConfigVO = null;
    private memberConfig:MemberConfigVO = null;
	
	protected initViews():void 
	{
		super.initViews();
		super.addEvents();

        // 获取节点/组件
        this.lbTitle = cc.find("layout_title/label_title", this.asset).getComponent(cc.Label);
        this.lbContent = cc.find("label_content", this.asset).getComponent(cc.Label);
        this.layReward = cc.find("layout_reward", this.asset);

		// 注册按钮点击事件
		this.btnGet = getNodeChildByName(this.asset, "button_get",CLanguage);
        this.btnGet.node.on("click", this.onClickGet, this)
        
		// 获取数据
        this.player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        this.memberConfig = GameDataManager.GetDictData(GameDataKey.MemberConfig,MemberConfigVO);
        
    }
    public bindPool(pool: CNodePool):void
    {
        this.pool = pool;
    }
	public update(data: SimpleMemberConfigVO):void
	{
        // 过滤
        if (!data || !this.pool) return;
        this.simpleMember = data;
        this.lbTitle.string = `VIP${data.vip}`;
        // this.lbContent.string = data.content;
        this.lbContent.string = "";
        let memberData = this.memberConfig.memberConfigs[data.vip];
        let info = memberData.dayRewards;
        for(let id in info) {
            let name = id == "1" ? getLang("Text_vipms4",[info[id]]) : getLang("Text_vipms5",[info[id]]);
            this.lbContent.string+=`${name}\n`;
        }
        if(data.vip > 0) {
            if(memberData.decline > 0)
                this.lbContent.string+=`${getLang("Text_vipms2",[memberData.decline])}\n`;
            if(memberData.power > 0)
                this.lbContent.string+=`${getLang("Text_dynamics")}+${memberData.power}`;
            if(memberData.gase > 0)
                this.lbContent.string+=` ${getLang("Text_gasser")}+${memberData.gase}`;
            if(memberData.aim > 0)
                this.lbContent.string+=` ${getLang("Text_gunsight")}+${memberData.aim}`;
            if(memberData.combat > 0)
                this.lbContent.string+=` ${getLang("Text_power")}+${memberData.combat}`;
        }
        // 回收节点
        this.pool.PutArr(this.layReward.children);
        // 添加节点
        for (let id in data.upgradeRewards)
        {
            let item = this.pool.Get();
            // 设置纹理
            let sp = item.getChildByName("sprite_icon").getComponent(cc.Sprite);
            ResourceManager.LoadSpriteFrame(`Lobby/LobbyIcon/LobbyIcon?:icon${id}`,sp);
            // 设置数量
            item.getChildByName("label_num").getComponent(cc.Label).string = data.upgradeRewards[id].toString();
            // 添加
            this.layReward.addChild(item);
        }
        let layout = getNodeChildByName(this.asset,"layout");
        let lbDesc = getNodeChildByName(layout,"vipDesc1",cc.Label);
        lbDesc.string = "vip"+data.vip;
        // 设置按钮开关
        if(Object.keys(data.upgradeRewards).length == 0) {
            this.btnGet.node.active = false;
            layout.active = false;
        }
        else {
            this.btnGet.node.active = true;
            layout.active = true;
            let btn = this.btnGet.node.getComponent(cc.Button);
            let myLevel = this.memberConfig.getMyVipLevel();
            if(myLevel < data.vip)
                btn.interactable = false;
            else {
                btn.interactable = !Boolean(this.memberConfig.levelGift >> data.vip & 1);
                this.btnGet.key = btn.interactable ? "btn_LingQu" : "yilingqu";
		        // ResourceManager.LoadSpriteFrame(`Lobby/LobbyMember/LobbyMember?:${name}`,this.btnGet.getComponent(cc.Sprite)); 
            }
        }
    }
	public dispose():void
	{
		super.dispose();
    }
   
    //会员升级奖励
    private onClickGet():void
    {
        C_Lobby_MemberAward.Send(this.simpleMember.vip);
    }
}