import { FObject } from "../../Framework/Core/FObject";
import {GoodsItemVO} from "./GoodsItemVO";
import { S2C_BuyGoods } from "../Networks/Protobuf/billiard_pb";
import { PayKinds, GoodsType, PayType } from "../LobbyScene/PayModeModule/PayDefine";


export class ShopGoodsVo extends FObject
{
    public static ClassName:string = "ShopGoodsVo";
    public goodsList: GoodsItemVO[] = [];
    public goodsTypeMap: Map<string, GoodsItemVO[]> = new Map();
    public goodsIDMap: Map<string, GoodsItemVO> = new Map();
    public shopPage: number = 0;
    private typeMap:  Map<string, number[]> = new Map();

    updateLotteryList(data: any): void{
        let index = 0;
        this.goodsList = [];
        this.goodsTypeMap = new Map();
        this.goodsIDMap = new Map();
        for (let key in data) {
            let elment = data[key];
            let item = new GoodsItemVO()
            item.update(elment);
            this.goodsList.push(item);
            this.goodsTypeMap[item.goodsType] || (this.goodsTypeMap[item.goodsType] = []);
            this.goodsTypeMap[item.goodsType].push(item);
            this.goodsIDMap[item.goodsId] = item;
            index++;
        }

        
    }

    getItemsByType(type: GoodsType, pay_kind?: PayKinds, isSort: boolean = true):GoodsItemVO[] {
        let items:GoodsItemVO[] = this.goodsTypeMap[type];
        if(items) {
            items = items.filter(item=> {
                return !!item.status;
            })
        }
        if(items && isSort) {
            items = items.sort((item1, item2)=> {
                return item1.price - item2.price;
            })
        }
        if(pay_kind) {
            items = items.filter(item=> {
                return item.payType == pay_kind;
            })
        }

        // 存储数量和下标关系
        if(!this.typeMap[type]) {
           this.analysisCountIndex(items, type);
        }
        return items;
    }

    analysisCountIndex(items: GoodsItemVO[], type:number) {
        let list = items.sort((item1, item2)=> {
            return item1.price - item2.price;
        })
        let arr: number[] = [];
        list.forEach(item=> {
            if(!arr.length || arr[arr.length - 1] < item.count) {
                item.count && arr.push(item.count);
            }
        })
        
        this.typeMap[type] = arr;
    }

    // 数量转换下标
    countTransIndex(type: GoodsType,count: number, max: number = 5):number {
        let index = 0;
        let countArr:number[] = this.typeMap[type];
        if(countArr) {
            for(let i = 0; i < countArr.length; i++) {
                index = i;
                if(count <= countArr[i] || i >= max) {
                    break;
                }
            }
        }
        return index;
    }

    getGoodsById(id: number):GoodsItemVO  {
        return this.goodsIDMap[id];
    }

    getGoodsBypayType(payType: PayKinds):GoodsItemVO[] {
        let goods:GoodsItemVO[] = [];
        this.goodsList.forEach(item=> {
            item.payType == payType &&  item.status && goods.push(item);
        })

        return goods;
    }

}
