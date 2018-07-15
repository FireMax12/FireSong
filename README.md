<p align="center">
  <img src="https://github.com/FireMax12/FireSong/blob/master/static/long.png" width="500" />
</p>

<p align="center">
  <img src="https://badges.frapsoft.com/os/v2/open-source.png?v=103" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" />
  <img src="https://img.shields.io/github/package-json/v/FireMax12/FireSong.svg" />
  <img src="https://img.shields.io/github/languages/code-size/FireMax12/FireSong.svg" />
  <img src="https://img.shields.io/github/license/FireMax12/FireSong.svg" />
</p>

Prebuilt version is available on the 'Releases' tab.

## Building

### Requirements
* Python 2
* Python 3
* node-gyp
* node.js 9.x or newer

### Windows
```bash
npm --add-python-to-path='true' --debug install --global windows-build-tools
npm install
npx electron-builder
```

## Keybinds
* **mouse4** - Go back _(on focus)_
* **mouse5** - Go forward _(on focus)_
* **F5** - Reload page _(on focus)_
* **Ctrl + Space** - Start/Stop music
* **Ctrl + Shift + N** - Play next music (skip)
