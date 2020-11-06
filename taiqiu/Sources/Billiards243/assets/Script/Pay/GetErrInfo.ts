import { LanguageManager } from "../../Framework/Managers/LanguageManager";
import { ERRINFO } from "../Networks/ERRDefine";


export function GetErrInfo(errno: number):string
{
    let err = "";
    let curLaunge = LanguageManager.CurrentName;
    let errs = ERRINFO[curLaunge];
    errs && (err = errs[errno]);
    return err;
}