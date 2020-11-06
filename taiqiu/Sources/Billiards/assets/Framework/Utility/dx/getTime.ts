import { Global } from './../../Datas/Global';

export function getTime():number 
{
	if(Global.START_TIME==0)Global.START_TIME= Date.now();
	return Date.now() - Global.START_TIME;
}
