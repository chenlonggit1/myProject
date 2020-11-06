import PopupWindow from "./PopupWindow";


const {ccclass, menu} = cc._decorator;
@ccclass
@menu("游戏模块/弹出模块/PopupConfirmWindow")
export default class PopupConfirmWindow extends PopupWindow
{
    public static ClassName:string = "PopupConfirmWindow";
}
