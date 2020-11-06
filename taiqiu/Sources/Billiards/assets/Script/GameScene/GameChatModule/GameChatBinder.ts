import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { PlayerVO } from "../../VO/PlayerVO";
import { addEvent } from "../../../Framework/Utility/dx/addEvent";
import { GameEvent } from "../../GameEvent";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { CNodePool } from "../../../Framework/Components/CNodePool";
import { C_Game_Chat } from "../../Networks/Clients/C_Game_Chat";
import { JTimer } from "../../../Framework/Timers/JTimer";
import { CLanguage } from "../../../Framework/Components/CLanguage";
import { getLang } from "../../../Framework/Utility/dx/getLang";

export class GameChatBinder extends FBinder {
    public static ClassName:string = 'GameChatBinder';
    private player:PlayerVO = null;
    private chatWindow:cc.Node = null;
    private closeMark:cc.Node = null;
    
    private btnItems:cc.Node[] = [];// btn
    private btnSpriteArr:any[] = [['btn_WenZi01','btn_WenZi02'],['btn_BiaoQing01','btn_BiaoQing02'],['btn_LiShiJiLu01','btn_LiShiJiLu02']];
    private menusNodeArr:any[] = [];// 切换的节点
    private currentTabIndex:number  = 0;//当前选中的tab
    private chatListArr:string[] = ["Text_chat1","Text_chat2","Text_chat3","Text_chat4","Text_chat5","Text_chat6","Text_chat7","Text_chat8",
    "Text_chat9","Text_chat10"];
	private chatPool:CNodePool = null;
    private expressPool:CNodePool = null;
    private chatHistoryPool:CNodePool = null;
    private chatHistoryScrollView:cc.Node = null;
    private myChat:cc.Node = null;// 我的聊天框
    private myChatLabel:cc.Label = null;// 我的聊天框
    private otherChat:cc.Node = null;// 其他人的聊天框
    private otherChatLabel:cc.Label = null;// 其他人的聊天框
    private otherExp:cc.Sprite = null; // 其他玩家的表情
    private myExp:cc.Sprite = null; // 我的表情
     
    public initViews() {
        super.initViews();

        this.player = GameDataManager.GetDictData(GameDataKey.Player,PlayerVO);
        this.chatWindow = getNodeChildByName(this.asset,'chat')

      

        this.myChat = getNodeChildByName(this.asset,'chatLeft');
        this.myChatLabel = getNodeChildByName(this.myChat,'text',cc.Label);

        this.otherChat = getNodeChildByName(this.asset,'chatRight')
        this.otherChatLabel = getNodeChildByName(this.otherChat,'text',cc.Label)

        this.otherExp = getNodeChildByName(this.asset,'exp_right',cc.Sprite) // 
        this.myExp = getNodeChildByName(this.asset,'exp_left',cc.Sprite)

        let chatMark = getNodeChildByName(this.chatWindow,'img_LiaoTianKuang')
       

        this.closeMark = getNodeChildByName(this.asset,'closeMark')
      
        this.closeMark.on(cc.Node.EventType.TOUCH_END, (e)=>{
            this.hideChatWindow();
        }, this);
        

        this.btnItems[0] = getNodeChildByName(chatMark,'tab/tab1');
        this.btnItems[1] = getNodeChildByName(chatMark,'tab/tab2');
        this.btnItems[2] = getNodeChildByName(chatMark,'tab/tab3');

        this.menusNodeArr[0] = getNodeChildByName(chatMark,'chatLayout');
        this.menusNodeArr[1] = getNodeChildByName(chatMark,'expressLayout');
        this.menusNodeArr[2] = getNodeChildByName(chatMark,'chatHistory');


        this.chatHistoryScrollView= getNodeChildByName(this.menusNodeArr[2],'view/content');

        let expressScrollView = getNodeChildByName(chatMark,'expressLayout/scrollView/view/content'); 
        var exp = getNodeChildByName(this.chatWindow,'exp')
        this.expressPool = new CNodePool(exp);

        for(let i=1;i<=20;i++){
            let expItem = this.expressPool.Get();
            ResourceManager.LoadSpriteFrame(`Game/TopInfo/eightBall_TopInfo?:exp${i}`, expItem.getComponent(cc.Sprite));
            expItem.active = true;
            expItem.name = "exp"+i;
            expItem.parent = expressScrollView;
            expItem.on(cc.Node.EventType.TOUCH_END, (e)=>{
                this.sendChat(expItem.name)
            }, this)
        }


        let historyItem = getNodeChildByName(this.chatWindow ,'historyItem');
        this.chatHistoryPool = new CNodePool(historyItem);

        let chatItem =  getNodeChildByName(this.chatWindow,'chatItem'); 
        this.chatPool = new CNodePool(chatItem);
        let chatScrollView = getNodeChildByName(chatMark,'chatLayout/view/content'); 
        for(let i=0;i<this.chatListArr.length;i++){
            let itemNode = this.chatPool.Get();
            itemNode.active = true;
            this.setPropagetion(itemNode)
            let Label = getNodeChildByName(itemNode,'text',CLanguage);   
            Label._key = this.chatListArr[i];
            // cc.log(LabelString);
            // cc.log();

            itemNode.parent = chatScrollView;
            itemNode.on(cc.Node.EventType.TOUCH_END, (e)=>{
                this.sendChat(getLang(Label._key))
            }, this)
        }

        this.btnItems[0].on(cc.Node.EventType.TOUCH_END, (e)=>{
            this.changeBtnTab(0)
        }, this);

        this.btnItems[1].on(cc.Node.EventType.TOUCH_END, (e)=>{
            this.changeBtnTab(1)
        }, this);

        this.btnItems[2].on(cc.Node.EventType.TOUCH_END, (e)=>{
            this.changeBtnTab(2)
        }, this);

        // ResourceManager.LoadSpriteFrame(`Game/TopInfo/eightBall_TopInfo?:icon${rewardArr[0]}`, icon1);

        
        this.setPropagetion(getNodeChildByName(chatMark,'tab'))
        this.setPropagetion(chatMark)
        this.setPropagetion(this.closeMark)
        this.setPropagetion(this.chatWindow)
        // this.setPropagetion(this.menusNodeArr[0])
        // this.setPropagetion(getNodeChildByName( this.menusNodeArr[0],'view'))
        // this.setPropagetion(getNodeChildByName( this.menusNodeArr[0],'view/content'))
        
        // this.setPropagetion(this.menusNodeArr[0])
        // this.setPropagetion(this.menusNodeArr[1])
        // this.setPropagetion(this.menusNodeArr[2])
    }


    private setPropagetion(node){
        node.on(cc.Node.EventType.TOUCH_START, function (e) { e.stopPropagation(); });
        node.on(cc.Node.EventType.TOUCH_END, function (e) { e.stopPropagation(); });
        node.on(cc.Node.EventType.TOUCH_MOVE, function (e) { e.stopPropagation(); });
    } 
   

    //发送表情、聊天
    private sendChat(text:string){
        C_Game_Chat.Send(text)
        this.hideChatWindow();
    }

    // 添加到聊天记录
    private pushHistory(id:any,text:string){
        var item =  this.chatHistoryPool.Get();

        if(text.indexOf('exp') != -1){
            let exp = getNodeChildByName(item,'exp',cc.Sprite); 
            ResourceManager.LoadSpriteFrame(`Game/TopInfo/eightBall_TopInfo?:${text}`, exp);
            exp.node.active = true;
        }else{
            let chatText = getNodeChildByName(item,'chatText',cc.Label); 
            chatText.string = text;
            chatText.node.active = true;
        }
        let name = getNodeChildByName(item,'name',cc.Label); 
        name.string = id+": ";

        item.active = true;
        item.parent = this.chatHistoryScrollView;


    }


    //tab点击切换
    private changeBtnTab(index:number){
        if(this.currentTabIndex == index){
            return false;
        }
        this.currentTabIndex = index;
        for(let i=0;i<this.btnItems.length;i++){
            this.menusNodeArr[i].active = false;
            ResourceManager.LoadSpriteFrame(`Game/TopInfo/eightBall_TopInfo?:${this.btnSpriteArr[i][0]}`, this.btnItems[i].getComponent(cc.Sprite));
        }
        this.menusNodeArr[index].active = true;
        ResourceManager.LoadSpriteFrame(`Game/TopInfo/eightBall_TopInfo?:${this.btnSpriteArr[index][1]}`, this.btnItems[index].getComponent(cc.Sprite));
    }
    
    private hideChatWindow(){
        this.chatWindow.active = false;
        this.closeMark.active = false;
    }

    private showChatWindow(){
        this.chatWindow.active = true;
        this.closeMark.active = true;
    }

    protected addEvents() {
        super.addEvents();
        addEvent(this, GameEvent.onShowChatWindow, this.showChatWindow);
        addEvent(this, GameEvent.onGetPlayerChat, this.onGetPlayerChat);

    }

    // 接收到其他玩家推送的聊天
    private onGetPlayerChat(data:any){
        let chat = data.data;
        this.pushHistory(chat.id,chat.emoji);
    }

    //聊天框的计时器
    private chatTimer(){

    }
}