import { EventManager } from "../Managers/EventManager";

const {ccclass, property,menu} = cc._decorator;
/**
 * 呼吸灯组件
 */

@ccclass
@menu("游戏特效/呼吸灯组件")
export default class LumosEffect extends cc.Component 
{
    public static ClassName:string = "LumosEffect";
    @property({displayName:"特效属性"})
    private attributeName:string = "opacity";
    @property({displayName:"开始值"})
    private startValue:number = 0;
    @property({displayName:"结束值"})
    private endValue:number = 0;
    @property({displayName:"持续时间"})
    private durtion:number = 0;
    @property({displayName:"重复"})
    private isLoop:boolean = true;
    @property({displayName:"来回缓动",visible(){return this.isLoop}})
    private isYoYo:boolean = true;
    @property({displayName:"自动运行"})
    private isAwakeStart:boolean = true;
    protected tween:cc.Tween;

    public startEffect():void
    {
        if(this.attributeName==""||this.attributeName==null)return;
        let d1 = JSON.parse('{"'+this.attributeName+'":'+this.startValue+'}');
        let d2 = JSON.parse('{"'+this.attributeName+'":'+this.endValue+'}');

        this.node.stopAllActions();
        for (const key in d1) 
            this.node[key] = d1[key];
        if(this.isLoop)
        {
            if(this.isYoYo)this.tween = cc.tween(this.node).to(this.durtion,d2).to(this.durtion,d1).union().repeatForever().start();
            else this.tween = cc.tween(this.node).to(this.durtion,d2).union().reverseTime().repeatForever().start();
        }
    }
    public onEnable():void
    {
        if(this.isAwakeStart)
            this.startEffect();
    }
    public onDisable():void
    {
        EventManager.removeEvent(this);
        this.node.stopAllActions();
    }
}
