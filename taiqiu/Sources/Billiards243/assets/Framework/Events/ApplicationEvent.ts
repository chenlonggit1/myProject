import { FEvent } from "./FEvent";

export class ApplicationEvent extends FEvent
{
    public static ClassName:string = "ApplicationEvent";
    /**退出应用程序的事件 */
    public static readonly ON_EXIT_APPLICATION:string = "OnExitApplication";
    /**点击返回按键（只有打包成app时才生效） */
    // public static readonly ON_NATIVE_KEY_BACK:string = "OnNativeKeyBack";
    // /**点击Home按键（只有打包成app时才生效） */
    // public static readonly ON_NATIVE_KEY_HOME:string = "OnNativeKeyHome";
    // /**点击菜单按键（只有打包成app时才生效） */
    // public static readonly ON_NATIVE_KEY_MENU:string = "OnNativeKeyMenu";
    // /**异形屏区域范围发生改变 */
    // public static readonly ON_NOTCH_RECT_CHANGE:string = "OnNotchRectChange";
    // /**
    //  * 当设备屏幕旋转了方向
    //  */
    // public static readonly ON_DEVICE_ORIENTATION_CHANGE:string = "OnDeviceOrientationChange";
}
