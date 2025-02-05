import { app, BrowserWindow, globalShortcut, Menu, ipcMain } from 'electron';
import started from 'electron-squirrel-startup';
import path  from 'node:path'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

let mainWindow
const createWindow = () => {
  console.log('createWindow')
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    alwaysOnTop: true,
    // visibleOnAllWorkspaces: true, // 在所有工作区都可见
    // fullscreenable: false, // 防止进入全屏模式
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    }
    // webPreferences: {
    //   preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    // },
  });

  const customUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.6834.159 Safari/537.36';
  mainWindow.webContents.setUserAgent(customUserAgent);


  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true, });
  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  // and load the index.html of the app.
  // mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.loadURL('https://chat.deepseek.com/');
  // Register a shortcut listener for Command+U to open a new window
  app.dock.show()
  focusOnInput(mainWindow)


  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
  // 监听窗口关闭事件（只是隐藏，不销毁）
  mainWindow.on('close', (event) => {
    if (!mainWindow.forceClose) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // app.dock.setIcon( 'assets/favicon.svg');

  console.log('app.whenReady')
  createWindow();
  // createMenu()
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    console.log('app.on activate')
    if (mainWindow) {
      mainWindow.show()
      app.dock.show()
      mainWindow.focus()
      setTimeout(() => {
        focusOnInput(mainWindow)
      })
      return
    }
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    console.log('app.quit')
    app.quit();
  }
});

app.on('before-quit', () => {
  mainWindow.forceClose = true; // 标记强制退出
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
function focusOnInput(win) {
  // 等待页面加载完成
  win.webContents.on('did-finish-load', () => {
    win.webContents.executeJavaScript(`
      document.querySelector('#chat-input').focus()
    `)
  })
}



function createMenu() {
  const isMac = process.platform === 'darwin'

  const template = [
    // { role: 'appMenu' }
    ...(isMac
      ? [{
        label: app.name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      }]
      : []),
    // { role: 'fileMenu' }
    {
      label: 'File',
      submenu: [
        {
          label: '设置',
          click: () => {
            createSetting();
          },
        },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    // { role: 'editMenu' }
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac
          ? [
            { role: 'pasteAndMatchStyle' },
            { role: 'delete' },
            { role: 'selectAll' },
            { type: 'separator' },
            {
              label: 'Speech',
              submenu: [
                { role: 'startSpeaking' },
                { role: 'stopSpeaking' }
              ]
            }
          ]
          : [
            { role: 'delete' },
            { type: 'separator' },
            { role: 'selectAll' }
          ])
      ]
    },
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac
          ? [
            { type: 'separator' },
            { role: 'front' },
            { type: 'separator' },
            { role: 'window' }
          ]
          : [
            { role: 'close' }
          ])
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://electronjs.org')
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function createSetting() {
  const settingWindow = new BrowserWindow({
    width: 400,
    height: 400,

    // mainWindow.setAlwaysOnTop(true, 'screen-saver');
    // mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });


    webPreferences: {
      // preload: path.join(__dirname, 'preload.js')
      // }
      // webPreferences: {
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });
  settingWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  settingWindow.setAlwaysOnTop(true, 'screen-saver');
  settingWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  app.dock.show()
  settingWindow.focus()
}

ipcMain.on('set-shortcut', (event, shortcut) => {
  console.log(`New shortcut set: ${shortcut}`);
  globalShortcut.unregisterAll();
  registerShortcut(shortcut);
});

const registerShortcut = (shortcut) => {

  globalShortcut.register(shortcut, () => {
    console.log(shortcut + 'is pressed');
    if (mainWindow && mainWindow.isVisible()) {
      mainWindow.hide();
      return
    }
    if (mainWindow) {
      mainWindow.setAlwaysOnTop(true, 'screen-saver');
      mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

      mainWindow.show()
      app.dock.show()

      mainWindow.focus()
      setTimeout(() => {
        focusOnInput(mainWindow)
      }, 1000)
    } else {
      console.log(BrowserWindow.getAllWindows().length)
      createWindow();
    }

  });
}