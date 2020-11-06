import { FObject } from "../../Framework/Core/FObject";

export class SimpleCardVO extends FObject 
{
    private static Suits = ["D","C","H","S"];
    // 1-13 方块 D
	// 14-26 梅花 C
	// 27-39 红桃 H
	// 40-52 黑桃 S
	// 53  14
	// 54  15
    public id:number = 0;// 代表牌的序号
    /**0：方块 D   1：梅花 C   2： 红桃 H    3：黑桃 S*/
    public suit:number = 0;
    public value:number = 0;// 代表牌的值


    public parse(num:number)
    {
        this.id = num;
        num = num-1;
        if(this.id==53)this.value = 14;
        else if(this.id==54)this.value = 15;
        else
        {
            this.suit = Math.floor(num/13);
            this.value = (num%13)+1;
        }
    }
    public toString()
    {
        if(this.id==0)return "BB";
        if(this.id>52)return this.id+"";
        return SimpleCardVO.Suits[this.suit]+this.value;
    }
}
