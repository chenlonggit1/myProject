import { FBinder } from "../../../Framework/Core/FBinder";
import { getNodeChildByName } from "../../../Framework/Utility/dx/getNodeChildByName";
import { SimplePlayerVO } from "../../VO/SimplePlayerVO";
import { StringUtility } from "../../../Framework/Utility/StringUtility";
import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { JTimer } from "../../../Framework/Timers/JTimer";
import { AudioManager } from "../../../Framework/Managers/AudioManager";
import { GameDataManager } from "../../GameDataManager";
import { GameDataKey } from "../../GameDataKey";
import { PlayerRoleVO } from "../../VO/PlayerRoleVO";

export class GamePlayerInfoBinder extends FBinder 
{
    private balls:cc.Sprite[]=[];
    private nickName:cc.Label = null;
    private level:cc.Label = null;
    private headImg:cc.Sprite = null;
    private countDown:cc.Label = null;
    private timePro:cc.ProgressBar = null;
    public playerIndex:number = 0;
    private timer:JTimer = null;
    /**倒计时，以ms为单位 */
    private countDownTime:number = 0;
    private totalCountDownTime:number = 0;
    private winNum:cc.Label = null;
    private imgBg:cc.Node = null;
    private bgTween:cc.Tween = null;

    public initViews()
    {
        super.initViews();
        this.nickName = getNodeChildByName(this.asset,"name",cc.Label);
        this.level = getNodeChildByName(this.asset,"level",cc.Label);
        this.countDown = getNodeChildByName(this.asset,"time",cc.Label);
        this.headImg = getNodeChildByName(this.asset,"headBg/mask/imgHead",cc.Sprite);
        this.timePro = getNodeChildByName(this.asset,"timePro",cc.ProgressBar);
        this.winNum = getNodeChildByName(this.asset,"winNum",cc.Label);
        this.imgBg = getNodeChildByName(this.asset,"img_bg");
        let b:cc.Node = getNodeChildByName(this.asset,"Balls");
        if(b!=null)
        {
            for (let i = 0; i < b.childrenCount; i++) 
                this.balls.push(b.children[i].getComponent(cc.Sprite));
        }
        this.clearPlayerInfo();
    }   
    public clearPlayerInfo()
    {
        this.nickName.string = "";
        this.level.string = "";
        if(this.winNum)this.winNum.string = "";
        this.stopTimer();
        for (let i = 0; i < this.balls.length; i++) 
            this.balls[i].spriteFrame = null;
    }
    public update(data:SimplePlayerVO)
    {
        if(data==null)return;
        this.nickName.string = StringUtility.Cut(data.nickName, 12);
        let playerRole:PlayerRoleVO = GameDataManager.GetDictData(GameDataKey.PlayerRole,PlayerRoleVO);
        let roleInfo = playerRole.getRole(data.roleId)
        if(roleInfo)this.level.string = roleInfo.star+"";
		if(data.head != null) 
		{
            let self = this;
			cc.assetManager.loadRemote(data.head, {ext: '.jpg'}, function(err, texture:cc.Texture2D) {
				if(err) return;
				self.headImg.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
			})
		}
        if(this.winNum)this.winNum.string = data.winNum.toString();
        if(this.balls.length<=0)return;
        this.updateBalls(data.strikeBalls.concat());
    }
    protected updateBalls(ids:number[])
    {
        while(ids.length<this.balls.length)
        {
            if(this.playerIndex==0)ids.unshift(-1);
            else ids.push(-1);
        }
        for (let i = 0; i < this.balls.length; i++) 
        {
            if(ids[i]<=0)this.balls[i].spriteFrame = null;
            else ResourceManager.LoadSpriteFrame('Game/EightBall/EightBall?:ball_' + ids[i], this.balls[i]);
        }
    }
    /**更新定时器，单位ms,传入0时清除 */
    public updateCountDown(num:number,allTime:number)
    {
        if(num<=0){
            this.imgBg.active = false;
            this.stopBgTween();
            this.stopTimer();
        }else 
        {
            this.countDownTime = num;
            this.totalCountDownTime = allTime;
            this.countDown.string = "";
            this.countDown.node.active = true;
            this.timePro.node.active = true;
            this.imgBg.active = true;
            this.stopBgTween();
            let self = this;
            this.bgTween = cc.tween(self.imgBg)
                .to(1, { opacity: 255 })
                .to(1, { opacity: 0 })
                .union()
                .repeatForever()
                .start();
            
            this.startTimer();
        }
    }

    private stopBgTween()
    {
        if(this.bgTween) {
            this.bgTween.stop();
            this.bgTween = null;
        }
    }
    private onTimeTick()
    {
        this.countDownTime-=this.timer.delay;
        if(this.countDownTime<=0)this.countDownTime = 0;
        let progress = this.countDownTime/this.totalCountDownTime;
        let time = (Math.floor(this.countDownTime/1000)+1);
        this.timePro.progress = progress;
        if(time>5)
        {
            if(progress>0.5)this.timePro.node.color = cc.Color.GREEN;
            else this.timePro.node.color = cc.Color.YELLOW;
            return;
        }
        AudioManager.PlayEffect("Fine_Tuning");
        this.timePro.node.color = cc.Color.RED;
        this.countDown.string = time.toString();
        if(this.countDownTime==0) this.stopTimer();
    }
    private startTimer()
    {
        if(this.timer==null)
        {
            this.timer = this.addObject(JTimer.GetTimer(50));
            this.timer.addTimerCallback(this,this.onTimeTick);
        }
        if(this.timer.running)return;
        this.timer.start();
    }
    private stopTimer()
    {
        this.countDown.string = "";
        this.countDown.node.active = false;
        this.timePro.node.active = false;
        if(!this.timer)return;
        this.timer.reset();
    }
}
