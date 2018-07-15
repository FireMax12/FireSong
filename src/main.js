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

  ipcMain.on('newTitle', (event, title) => {
    win.setTitle(`${pack.name} v${pack.version} | ${title}`);
  });

  win.loadURL(`file://${__dirname}/index.htm`);

  // Go back, Go forward bindings
  ioHook.on('mouseup', event => {
    if (!win)
      return;
    if (event.button == 4 && win.isFocused())
      return win.webContents.send('go', 'back');
    if (event.button == 5 && win.isFocused())
      return win.webContents.send('go', 'forward');
  });

  // Keybindings
  const startStop = ioHook.registerShortcut([29, 57], keys => { // Bind Ctrl + Space
    if (!win)
      return;
    return win.webContents.send('startStop'); // Start/Stop music
  });

  const reloadPage = ioHook.registerShortcut([63], keys => { // Bind F5
    if (!win)
      return;
    if (win.isFocused())
      return win.webContents.send('reload'); // Reload page
  });

  const saveMusic = ioHook.registerShortcut([29, 31], keys => { // Bind Ctrl + S
    if (!win)
      return;
    if (win.isFocused())
      return win.webContents.send('save');
  });

  const nextMusic = ioHook.registerShortcut([29, 42, 49], keys => { // Bind Ctrl + Shift + N
    if (!win)
      return;
    return win.webContents.send('next');
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