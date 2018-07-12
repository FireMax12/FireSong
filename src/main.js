/**
 * Copyright © 2018.
 * FireSong is the work of David Csizmadia <firemax12b@gmail.com>, Milan Szekely <szekelymilan1125@gmail.com>
*/
'use strict';

const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const ioHook = require('./iohook');
const pack = require('../package.json');

app.setAppUserModelId('com.firemax12.firesong');
autoUpdater.checkForUpdatesAndNotify();

app.on('ready', () => {
  let win = new BrowserWindow({ width: 1600, height: 900, icon: `${__dirname}/icon.png`, title: pack.name });
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

  let YouTubeState = false;
  win.loadURL(`file://${__dirname}/index.htm`);

  ipcMain.on('changeYouTubeState', (event, state) => {
    YouTubeState = state;
  });

  const sendInput = key => {
    win.webContents.sendInputEvent({ type: 'keyDown', keyCode: key });
    win.webContents.sendInputEvent({ type: 'keyUp', keyCode: key });
  };

  // Go back, Go forward bindings
  ioHook.on('mouseup', event => {
    if (!win || !YouTubeState)
      return;
    if (event.button == 4 && win.isFocused())
      return win.webContents.goBack();
    if (event.button == 5 && win.isFocused())
      return win.webContents.goForward();
  });

  // Keybindings
  const startStop = ioHook.registerShortcut([29, 57], keys => { // Bind Ctrl + Space
    if (!win || !YouTubeState)
      return;
    return sendInput('\u004B'); // Send 'K' key for YouTube
  });

  const reloadPage = ioHook.registerShortcut([63], keys => { // Bind F5
    if (!win || !YouTubeState)
      return;
    if (win.isFocused())
      return win.webContents.reloadIgnoringCache(); // Reload page
  });
  
  const saveMusic = ioHook.registerShortcut([29, 31], keys => {
    if (!win || !YouTubeState)
      return;
    if (win.isFocused())
      return save(win.webContents.getURL());
  });

  ioHook.start();
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('before-quit', () => {
  ioHook.unload();
  ioHook.stop();
});

function save(url) {
  console.log(`Saving has been triggered for: ${url}`);
}