import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { ModuleNames } from "../../ModuleNames";
import { GameLayer } from "../../../Framework/Enums/GameLayer";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { C_Lobby_UseRole } from "../../Networks/Clients/Role/C_Lobby_UseRole";
import { PlayerRoleVO } from "../../VO/PlayerRoleVO";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { GameEvent } from "../../GameEvent";
import { LobbyEvent } from "../../Common/LobbyEvent";
import { getLang } from "../../../Framework/Utility/dx/getLang";

/**
*@description:大厅角色模块
**/
export class LobbyRoleBinder extends FBinder 
{
	public static ClassName:string = "LobbyRoleBinder";
	
	private imgLight:cc.Sprite = null;
	private role:cc.Node[] = [];
	private roleDesc1:cc.Label[] = [];
	private roleDesc2:cc.Label[] = [];
	private roleText1:cc.Label[] = [];
	private roleText2:cc.Label[] = [];
	private roleProgressBar:cc.ProgressBar[] = [];
	private roleLevel:cc.Label[] = [];
	private roleIndex = 0;
	private playerRole:PlayerRoleVO = null;

	protected initViews():void
	{
		super.initViews();

		let btnBack = getNodeChildByName(this.asset,"btn_back");
		btnBack.on(cc.Node.EventType.TOUCH_END, () => {
			dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.Lobby_Role, null, GameLayer.UI);
		}, this);

		this.imgLight = getNodeChildByName(this.asset, "img_Guang");
		for(let i = 0; i < 2; i++) {
			let role = getNodeChildByName(this.asset, `role${i+1}`);
			this.role[i] = getNodeChildByName(role, "role");
			role.on(cc.Node.EventType.TOUCH_END, () => {
				this.selectRole(i);
			}, this);
			this.roleDesc1[i] = getNodeChildByName(this.asset, `roleNode${i+1}/descLayout/lbDesc0`,cc.Label);
			this.roleDesc2[i] = getNodeChildByName(this.asset, `roleNode${i+1}/descLayout/lbDesc1`,cc.Label);
			this.roleText1[i] = getNodeChildByName(this.asset, `roleNode${i+1}/descLayout/lbtext0`,cc.Label);
			this.roleText2[i] = getNodeChildByName(this.asset, `roleNode${i+1}/descLayout/lbtext1`,cc.Label);
			this.roleLevel[i] = getNodeChildByName(this.asset, `roleNode${i+1}/level`,cc.Label);
			this.roleProgressBar[i] = getNodeChildByName(this.asset, `roleNode${i+1}/LvProgressBar`,cc.ProgressBar);
		}

		let btnConfirm = getNodeChildByName(this.asset, "btn_confirm");
		btnConfirm.on(cc.Node.EventType.TOUCH_END, () => {
			this.confirmClick();
		}, this);
		this.playerRole = GameDataManager.GetDictData(GameDataKey.PlayerRole,PlayerRoleVO);
	}

	protected addEvents()
	{
		super.addEvents();
		addEvent(this,LobbyEvent.Switch_Role,this.onSwitchRole);
	}

	//设置角色
	public setRole()
	{
		for(let i = 0; i < this.playerRole.myPlayerRoles.length; i++) {
            if(this.playerRole.myPlayerRoles[i].isUse == 1) {
				for(let j = 0; j < 2; j++) {
					let scaleVal = j == i ? 0.9 : 0.85;
					let colorVal = j == i ? cc.color(255,255,255,255) : cc.color(130,130,130,255);
					this.role[j].getComponent(dragonBones.ArmatureDisplay).timeScale = j == i ? 1 : 0;
					this.role[j].setScale(scaleVal);
					this.role[j].color = colorVal;
				}
				this.roleIndex = i;
				break;
			} 
		}
		this.setRoleInfo();
	}

	//设置角色信息
	private setRoleInfo()
	{
		for(let i = 0; i < this.playerRole.myPlayerRoles.length; i++) {
			let roleInfo = this.playerRole.myPlayerRoles[i];
			this.roleDesc1[i].string = "";
			this.roleDesc2[i].string = "";
			this.roleText1[i].node.active = roleInfo.power > 0;
			this.roleText2[i].node.active = roleInfo.combat > 0;
			if(roleInfo.power > 0)
				this.roleDesc1[i].string=`+${roleInfo.power}`;
			if(roleInfo.combat > 0)
				this.roleDesc2[i].string=`+${roleInfo.combat}`;
				
			this.roleLevel[i].string = roleInfo.star.toString();
			let nextRole = this.playerRole.getRole(this.playerRole.myPlayerRoles[i].roleId+1);
			if (nextRole)
				this.roleProgressBar[i].progress = roleInfo.exp/nextRole.roleExp;
			else 
				this.roleProgressBar[i].progress = 1;
		}
	}

	//选择角色
	private selectRole(index)
	{
		if(index == this.roleIndex) return;
		this.roleIndex = index;
		for(let i = 0; i < 2; i++) {
			let scaleVal = i == index ? 0.9 : 0.85;
			let colorVal = i == index ? cc.color(255,255,255,255) : cc.color(130,130,130,255);
			this.role[i].getComponent(dragonBones.ArmatureDisplay).timeScale = i == index ? 1 : 0;
			cc.tween(this.role[i])
				.to(0.3, { scale : scaleVal , color : colorVal})
				.start();
		}
	}

	//确定切换角色
	private confirmClick()
	{
		C_Lobby_UseRole.Send(this.playerRole.myPlayerRoles[this.roleIndex].id);
	}

	//切换角色
	private onSwitchRole()
	{
		dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.Lobby_Role, null, GameLayer.UI);
	}
}