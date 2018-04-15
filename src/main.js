'use strict';

const {app, BrowserWindow, globalShortcut} = require('electron');
const ioHook = require('./iohook');
const pack = require('../package.json');

app.on('ready', () => {
  let win = new BrowserWindow({width: 1600, height: 900, icon: __dirname + '/../static/icon.png', title: pack.name});
  win.setMenu(null);

  win.on('closed', () => {
    win = null;
  });

  win.on('page-title-updated', (event, title) => {
    event.preventDefault();
    win.setTitle(`${pack.name} v${pack.version} | ${title}`);
  });

  win.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    win.loadURL(url);
  });

  win.loadURL('https://www.youtube.com');

  const sendInput = (key) => {
    win.webContents.sendInputEvent({ type: 'keyDown', keyCode: key });
    win.webContents.sendInputEvent({ type: 'keyUp', keyCode: key });
  };

  // Go back, Go forward bindings
  ioHook.on('mouseup', (event) => {
    if (!win)
      return;
    if (event.button == 4 && win.isFocused())
      return win.webContents.goBack();
    if (event.button == 5 && win.isFocused())
      return win.webContents.goForward();
  });

  // Start / Stop video with bindings
  const binding = ioHook.registerShortcut([29, 57], (keys) => { // Bind Ctrl + Space
    sendInput('\u004B'); // Send 'K' key for YouTube
  });
   
  ioHook.start();
});

app.on('before-quit', () => {
  ioHook.unload();
  ioHook.stop();
});
