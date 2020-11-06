import { FEvent } from "./FEvent";

export class SoundEvent extends FEvent
{
    public static ClassName:string = "SoundEvent";
	/**播放数字 * */
	public static PLAY_NUMBER: string = "OnPlayNumber";
	/**播放音效 * */
	public static PLAY_EFFECT: string = "OnPlayEffect";
	/**播放人声音效* */
    public static PLAY_VOICE: string = "OnPlayVoice";
    /**播放背景音乐* */
    public static PLAY_MUSIC:string = "OnPlayMusic";
}
