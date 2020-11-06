
export function graySprite(gray:boolean,sp:cc.Sprite)
{
    let material = null;
    if(gray)material = cc.Material.getBuiltinMaterial('2d-gray-sprite');
    else material = cc.Material.getBuiltinMaterial('2d-sprite');
    material = cc.MaterialVariant.create(material, sp);
    sp.setMaterial(0, material);
}
