import { Application } from "../../Core/Application";

export function getCamera (name: string) : cc.Camera
{
    return Application.CurrentScene.getCamera(name);
}