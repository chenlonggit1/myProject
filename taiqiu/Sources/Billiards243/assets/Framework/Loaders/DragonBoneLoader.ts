import { LoaderType } from "../Enums/LoaderType";
import { StoreManager } from "../Managers/StoreManager";
import { Loader } from "./Loader";
import { CacheManager } from "../Managers/CacheManager";
export class DragonBoneLoader extends Loader {
    public static ClassName: string = "DragonBoneLoader";
    private boneData: { name: string, ske: string, tex: string, img: string } = null;
    private isDragonBoneError: boolean = false;
    public load(url: any, assetType?: any, loaderType?: LoaderType): void {
        this.boneData = url;
        this.loads([url.ske, url.tex], [dragonBones.DragonBonesAsset, dragonBones.DragonBonesAtlasAsset]);
    }
    protected complete(): void {
        if (this.cacheAsset) {
            let data = { dragonAsset: this.getContent(0), dragonAtlasAsset: this.getContent(1) };
            if (!CacheManager.HasCache(this.boneData.name)) {
                CacheManager.Cache(this.boneData.name, data);
            }
        }
        this._urls = [this.boneData.name];
        this._loaderTypes = [LoaderType.DRAGON_BONE];
        this.excuteCallback("onComplete");
        this.dispose();
    }
    protected loadAsset(): void {
        if (this.isDragonBoneError) return;
        super.loadAsset();
    }
    protected onLoadError(err: any): void {
        this.isDragonBoneError = true;
        this.excuteCallback("onError", { resName: this.boneData.name, message: err.message, index: this._index, loaderType: this.getLoaderType(this._index) });
        //super.onLoadError(err);
    }

    public dispose(): void {
        this.isDragonBoneError = false;
        this.boneData = null;
        super.dispose();
    }
    public static Get(): DragonBoneLoader {
        return StoreManager.New(DragonBoneLoader);
    }
}
