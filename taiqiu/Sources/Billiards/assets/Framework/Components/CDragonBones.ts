
/**龙骨 */
export class CDragonBones {
    /**
	 * 设置龙骨动画
	 * @param animation 龙骨动画
	 * @param asset 骨骼数据
	 * @param atlasAsset 骨骼纹理数据
	 * @param armatureName 当前的 Armature 名称
	 * @param animationName 动画名称
	 * @param playTimes 播放动画的次数 -1为使用配置文件中的次数。0为无限循环播放。>0为动画的重复次数。
	 */
	public static setDragonBones(animation:dragonBones.ArmatureDisplay,asset,atlasAsset,armatureName,animationName,playTimes)
	{
		//先清空龙骨
		animation.dragonAsset = null;
		animation.dragonAtlasAsset = null;
		animation.armatureName = '';
		//加载龙骨
		cc.resources.load(
			asset,
			dragonBones.DragonBonesAsset,
			function(err, res:dragonBones.DragonBonesAsset) {
				cc.resources.load(
					atlasAsset,
					dragonBones.DragonBonesAtlasAsset,
					function(err2,res2:dragonBones.DragonBonesAtlasAsset) {
						animation.dragonAsset = res;
						animation.dragonAtlasAsset = res2;
						animation.armatureName = armatureName;
						animation.playAnimation(animationName,playTimes);
					}
				)
			}
		)
	}
}