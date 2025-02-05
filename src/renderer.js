/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import * as a  from 'electron'
// const  a = require('electron');
console.log(a)
// import './index.css';

// console.log('👋 This message is being logged by "renderer.js", included via webpack');


document.getElementById('shortcut-form').addEventListener('submit', (event) => {
  console.log('submit');
  event.preventDefault();
  const modifiers = Array.from(document.getElementById('modifiers').selectedOptions).map(option => option.value);
  const key = document.getElementById('key').value;
  const shortcut = [...modifiers, key].join('+');
  ipcRenderer.send('set-shortcut', shortcut);
});
