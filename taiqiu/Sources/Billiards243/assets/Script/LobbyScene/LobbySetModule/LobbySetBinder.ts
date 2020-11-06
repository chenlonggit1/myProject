import { CLanguage } from "../../../Framework/Components/CLanguage";
import { FBinder } from "../../../Framework/Core/FBinder";
import { GameLayer } from "../../../Framework/Enums/GameLayer";
import { ApplicationEvent } from "../../../Framework/Events/ApplicationEvent";
import { ModuleEvent } from "../../../Framework/Events/ModuleEvent";
import { SceneEvent } from "../../../Framework/Events/SceneEvent";
import { AudioManager } from "../../../Framework/Managers/AudioManager";
import { ClientManager } from "../../../Framework/Managers/ClientManager";
import { EventManager } from "../../../Framework/Managers/EventManager";
import { LanguageManager } from "../../../Framework/Managers/LanguageManager";
import { ProxyManager } from "../../../Framework/Managers/ProxyManager";
import { dispatchFEvent } from "../../../Framework/Utility/dx/dispatchFEvent";
import { dispatchModuleEvent } from "../../../Framework/Utility/dx/dispatchModuleEvent";
import { getLang } from "../../../Framework/Utility/dx/getLang";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { ClientNames } from "../../ClientNames";
import { Native } from "../../Common/Native";
import { showPopup } from "../../Common/showPopup";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { LoginMediator } from "../../LoginScene/LoginMediator";
import { ModuleNames } from "../../ModuleNames";
import { C_Game_QuitGame } from "../../Networks/Clients/C_Game_QuitGame";
import { PopupType } from "../../PopupType";
import { SceneNames } from "../../SceneNames";
import { PlayerVO } from "../../VO/PlayerVO";
import { LobbyMediator } from "../LobbyMediator";

/**
*@description:大厅设置模块
**/
export class LobbySetBinder extends FBinder 
{
	public static ClassName:string = "LobbySetBinder";
	
	private btnChinese:CLanguage = null;
	private btnUighur:CLanguage = null;
	private musicSwitch:cc.Node = null;
	private musicText:CLanguage = null;
	private soundSwitch:cc.Node = null;
	private soundText:CLanguage = null;
	private btnChange:cc.Node = null;
	private btnQuit:cc.Node = null;
	private btnQuitGame:cc.Node = null;

	private bIsChinese:boolean = false;
	private bIsOpenMusic:boolean = true;
	private bIsOpenSound:boolean = true;
	private versionText:cc.Label = null;
	private player:PlayerVO = null;

	protected initViews():void
	{
		super.initViews();

		let btnBack = getNodeChildByName(this.asset,"btn_back");
		btnBack.on(cc.Node.EventType.TOUCH_END, () => {
			dispatchModuleEvent(ModuleEvent.HIDE_MODULE, ModuleNames.Lobby_Set);
		}, this);

		this.btnChange = getNodeChildByName(this.asset, "btn_change");
		this.btnQuit = getNodeChildByName(this.asset, "btn_quit");
		this.btnQuitGame = getNodeChildByName(this.asset, "btn_quitGame");
		this.btnChinese = getNodeChildByName(this.asset, "btn_chinese",CLanguage);
		this.btnUighur = getNodeChildByName(this.asset, "btn_uighur",CLanguage);
		let btnMusic = getNodeChildByName(this.asset, "btn_music");
		let btnSound = getNodeChildByName(this.asset, "btn_sound");

		this.musicSwitch = getNodeChildByName(btnMusic, "btn_switch");
		this.musicText = getNodeChildByName(btnMusic, "lbText", CLanguage);
		this.soundSwitch = getNodeChildByName(btnSound, "btn_switch");
		this.soundText = getNodeChildByName(btnSound, "lbText", CLanguage);
		this.versionText = getNodeChildByName(this.asset, "version", cc.Label);

		this.btnChange.on(cc.Node.EventType.TOUCH_END, () => {
			this.changeAccount();
		}, this);
		this.btnQuit.on(cc.Node.EventType.TOUCH_END, () => {
			this.exitGame();
		}, this);
		this.btnQuitGame.on(cc.Node.EventType.TOUCH_END, () => {
			this.quitGame();
		}, this);
		this.btnChinese.node.on(cc.Node.EventType.TOUCH_END, () => {
			this.changeLanguage(true);
		}, this);
		this.btnUighur.node.on(cc.Node.EventType.TOUCH_END, () => {
			this.changeLanguage(false);
		}, this);
		btnMusic.on(cc.Node.EventType.TOUCH_END, () => {
			this.changeMusic(true);
		}, this);
		btnSound.on(cc.Node.EventType.TOUCH_END, () => {
			this.changeSound(true);
		}, this);
		this.player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
		this.bIsChinese = this.player.isChinese;
		this.bIsOpenMusic = AudioManager.IsCanPlayMusic;
		this.bIsOpenSound = AudioManager.IsCanPlayEffect;
		this.versionText.string = "V" + Native.getResVersion();
		this.setBtnState();
		this.changeMusic(false);
		this.changeSound(false);
	}

	private changeLanguage(isChinese)
	{
		if(isChinese == this.bIsChinese) return;
		this.bIsChinese = isChinese;
		let languageIndex = this.bIsChinese?0:1;
		LanguageManager.ChangeLanguage(languageIndex);
		GameDataManager.SetShareData("language",languageIndex);
		this.player.isChinese = isChinese;
	}

	private setBtnState()
	{
		this.btnChange.active = cc.director.getScene().name == "LobbyScene";
		this.btnQuit.active = cc.director.getScene().name == "LobbyScene";
		// this.btnQuitGame.active = cc.director.getScene().name != "LobbyScene"; // 不要退出游戏功能了
		
	}

	private changeMusic(isClick)
	{
		if(isClick)
			this.bIsOpenMusic = !this.bIsOpenMusic;
		this.musicSwitch.x = this.bIsOpenMusic ? 110 : -110;
		this.musicText.node.x = this.bIsOpenMusic ? -45 : 45;
		this.musicText.key = this.bIsOpenMusic ? "Text_open" : "Text_close";
		this.musicText.node.color = this.bIsOpenMusic ? (new cc.Color(34, 194, 205)) : (new cc.Color(102, 98, 116));
		AudioManager.IsCanPlayMusic = this.bIsOpenMusic;
		GameDataManager.SetShareData("openMusic",AudioManager.IsCanPlayMusic);
		if(this.bIsOpenMusic)
		{
			if(cc.director.getScene().name=="LobbyScene") AudioManager.PlayMusic("Billiards_Bg_3");
			else AudioManager.PlayMusic("Billiards_Bg_2");
		}
	}

	private changeSound(isClick)
	{
		if(isClick)
			this.bIsOpenSound = !this.bIsOpenSound;
		this.soundSwitch.x = this.bIsOpenSound ? 110 : -110;
		this.soundText.node.x = this.bIsOpenSound ? -45 : 45;
		this.soundText.key = this.bIsOpenSound ? "Text_open" : "Text_close";
		this.soundText.node.color = this.bIsOpenSound ? (new cc.Color(34, 194, 205)) : (new cc.Color(102, 98, 116));
		AudioManager.IsCanPlayEffect = this.bIsOpenSound;
		GameDataManager.SetShareData("openSound",AudioManager.IsCanPlayEffect);
	}

	//退出比赛
	private quitGame()
	{
		let quitCallBack = ()=>{
			GameDataManager.SetDictData(GameDataKey.Room,null);
			GameDataManager.SetDictData(GameDataKey.Table,null);
			if(this.player.id==0)return;
			let lobbyMediator:LobbyMediator = new LobbyMediator();
			dispatchModuleEvent(ModuleEvent.SHOW_MODULE,ModuleNames.Preload,null,GameLayer.Popup);
			dispatchFEvent(new SceneEvent(SceneEvent.CHANGE_SCENE,SceneNames.Lobby,lobbyMediator));
		}
		showPopup(PopupType.WINDOW,{
			msg:getLang("Text_tcts1"),
			onConfirm:() => {
				C_Game_QuitGame.Send();
				quitCallBack();
			}
		},true);
	}

	//切换账号
	private changeAccount()
	{
		GameDataManager.SetShareData("token","");
		ProxyManager.ProxyDispose("GameProxy");
		GameDataManager.SetDictData(GameDataKey.Room,null);
		GameDataManager.SetDictData(GameDataKey.Table,null);
		GameDataManager.SetDictData(GameDataKey.Player,null);
		let loginMediator:LoginMediator = new LoginMediator();
		dispatchModuleEvent(ModuleEvent.SHOW_MODULE,ModuleNames.Preload,null,GameLayer.Popup);
		dispatchFEvent(new SceneEvent(SceneEvent.CHANGE_SCENE,SceneNames.Login,loginMediator));
	}

	//退出游戏
	private exitGame()
	{
		if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS){
			showPopup(PopupType.WINDOW,{
				msg:getLang("Text_tcts2"),
				onConfirm:() => {
					EventManager.dispatchEventWith(ApplicationEvent.ON_EXIT_APPLICATION);
				}
			},true);
		}
	}
}