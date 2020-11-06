export function excuteNodeEvents(events:cc.Component.EventHandler[],evt?:any):void
{
    if(events==null)return;
    for (let i = 0; i < events.length; i++) 
    {
        let handler = events[i];
        let target = null;
        if(handler.component==null||handler.component=="")
        {
            if(handler["_componentName"]==null||handler["_componentName"]=="")continue;
            target = handler.target.getComponent(handler["_componentName"]);
        }else target = handler.target.getComponent(handler.component);
        if(target==null)continue;
        let fun: Function = target[handler.handler];
        if(fun==null)continue;
        if (fun.length == 0) fun.apply(target);
        else if (fun.length == 1) fun.apply(target, [evt]);
        else if (fun.length == 2) fun.apply(target, [evt, handler.customEventData]);
    }
}
