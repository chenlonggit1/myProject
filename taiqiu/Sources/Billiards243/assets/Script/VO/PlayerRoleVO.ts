import { FObject } from "../../Framework/Core/FObject";
import { SimplePlayerRoleVO } from "./SimplePlayerRoleVO";

export class PlayerRoleVO extends FObject
{
    public static ClassName:string = "PlayerRoleVO";

    //角色
    public playerRoles:SimplePlayerRoleVO[] = [];
    //我的角色
    public myPlayerRoles:SimplePlayerRoleVO[] = [];
    
    //更新角色
    public updateRoles(data):void
    {
        let index = 0;
        for (let key in data) {
            this.playerRoles.push(new SimplePlayerRoleVO());
            this.playerRoles[index].update(data[key]);
            index++;
        }
    }

    //设置我的角色
    public setMyRoles(data):void
    {
        this.myPlayerRoles = [];
        for (let i = 0; i < data.length; i++) {
            let myRole = this.getRole(data[i].roleId);
            this.myPlayerRoles.push(new SimplePlayerRoleVO());
            this.myPlayerRoles[this.myPlayerRoles.length-1].update(myRole);
            this.myPlayerRoles[this.myPlayerRoles.length-1].id = data[i].id;
            this.myPlayerRoles[this.myPlayerRoles.length-1].isUse = data[i].isUse;
            this.myPlayerRoles[this.myPlayerRoles.length-1].exp = data[i].exp;
            this.myPlayerRoles[this.myPlayerRoles.length-1].roleId = data[i].roleId;
        }
    }

    //更新角色使用
    public updateRoleUse(id):void
    {
        for(let i = 0; i < this.myPlayerRoles.length; i++) {
            this.myPlayerRoles[i].isUse = this.myPlayerRoles[i].id == id ? 1 : 0;
        }
    }

    //更新我的角色
    public updateMyRoles(data):void
    {
        let index = this.getMyHasRole(data.roleId);
        if(index > -1) {
            this.myPlayerRoles[index].update(data);
        } else {
            for(let i = 0; i < this.myPlayerRoles.length; i++) {
                if(this.myPlayerRoles[i].id == data.id){
                    let myRole = this.getRole(data.roleId);
                    this.myPlayerRoles[i].update(myRole);
                    this.myPlayerRoles[i].id = data.id;
                    this.myPlayerRoles[i].isUse = data.isUse;
                    this.myPlayerRoles[i].exp = data.exp;
                    this.myPlayerRoles[i].roleId = data.roleId;
                    break;
                }
            }
        }
    }

    //获取角色
    public getRole(roleId):SimplePlayerRoleVO
    {
        for(let i = 0; i < this.playerRoles.length; i++) {
            if(this.playerRoles[i].id == roleId) {
                return this.playerRoles[i];
            }
        }
        return null;
    }

    //获取自己是否有角色
    public getMyHasRole(roleID):number
    {
        let result = -1;
        for(let i = 0; i < this.myPlayerRoles.length; i++) {
            if(this.myPlayerRoles[i].roleId == roleID){
                return i;
            }
        }
        return result;
    }

    //获取当前使用的角色
    public getMyRole():SimplePlayerRoleVO
    {
        for(let i = 0; i < this.myPlayerRoles.length; i++) {
			let roleInfo = this.myPlayerRoles[i];
			if(roleInfo.isUse == 1) {
                return roleInfo;
            }
        }
        return null;
    }
}
