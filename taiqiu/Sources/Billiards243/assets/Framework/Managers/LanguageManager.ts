import { ILanguage } from "../Interfaces/ILanguage";
import { ResourceManager } from "./ResourceManager";
import { Fun } from "../Utility/dx/Fun";
import { CacheManager } from "./CacheManager";
import { Assets } from "../Core/Assets";
import { trace } from "../Utility/dx/trace";



export class LanguageManager {
    public static LanguageNames: string[] = [];
    private static items: ILanguage[] = [];
    private static langData: object = null;
    private static langIndex: number = -100;
    private static isLoading: boolean = false;

    public static AddItem(item: ILanguage): void {
        if (item == null) return;
        if (this.items.indexOf(item) == -1)
            this.items.push(item);
        if (this.langIndex < 0) return;
        item.onChangeLanguage(this.langIndex);
    }
    public static RemoveItem(item: ILanguage): void {
        if (item == null) return;
        let index = this.items.indexOf(item);
        if (index != -1) this.items.splice(index, 1);
    }
    public static GetLang(key: string): string {
        if (this.langData == null || this.langData[key] == undefined) {
            // trace("获取无效多语言Key===>",key);
            return key;
        }
        return this.langData[key];
    }
    public static ChangeLanguage(lang: any): void {
        if (typeof lang === "string")
            lang = this.LanguageNames.indexOf(lang);
        if (typeof lang === "number") {
            if (lang < 0 || lang == this.langIndex || this.isLoading) return;
            this.isLoading = true;
            ResourceManager.LoadText(this.GetAssetName(lang), Fun(this.onLanguageComplete, this, true, [lang]));
        }
    }
    private static onLanguageComplete(index: number): void 
    {
        this.isLoading = false;
        let assetName = this.GetAssetName(index);
        if (CacheManager.HasCache(assetName)) {
            let asset = CacheManager.GetCache(assetName);
            this.langData = asset.json;
            this.langIndex = index;
            this.onChangeLanguage();
        }
    }
    private static onChangeLanguage(): void {
        for (let i = 0; i < this.items.length; i++)
            this.items[i].onChangeLanguage(this.langIndex);
    }
    private static GetAssetName(index: number): string { return Assets.GetLanguage(this.LanguageNames[index]); }

    public static get CurrentIndex(): number { return this.langIndex; }
    public static get CurrentName(): string {
        if (this.langIndex < -1) return null;
        return this.LanguageNames[this.langIndex];
    }
    public static Print()
    {
        trace("----------------- Start Languages----------------------");
        for (let i = 0; i < this.items.length; i++)
            trace("===>",this.items[i]);
        trace("-----------------Total Languages:"+this.items.length+"----------------------");
    }
}