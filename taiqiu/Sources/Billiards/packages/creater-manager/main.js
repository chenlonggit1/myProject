'use strict';
module.exports = 
{
  load () 
  {

  },
  messages: 
  {
    'open' () 
    {
      Editor.Panel.open('creater-manager');
    },
    'say-hello' () 
    {
      Editor.log('Hello World!');
      Editor.Ipc.sendToPanel('creater-manager', 'creater-manager:hello');
    },
    'clicked' () 
    {
      Editor.log('Button clicked!');
    }
  },
};