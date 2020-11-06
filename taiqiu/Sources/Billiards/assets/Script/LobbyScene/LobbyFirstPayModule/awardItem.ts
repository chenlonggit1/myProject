import { ResourceManager } from "../../../Framework/Managers/ResourceManager";
import { GameDataKey } from "../../GameDataKey";
import { GameDataManager } from "../../GameDataManager";
import { GoodsItemVO } from "../../VO/GoodsItemVO";
import { PlayerVO } from "../../VO/PlayerVO";
import { GoodsId } from "../PayModeModule/PayDefine";


const {ccclass, property} = cc._decorator;

@ccclass
export default class awardItem extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Sprite)
    spr_content: cc.Sprite = null;

    @property(cc.Sprite)
    spr_flag: cc.Sprite = null;

}
