const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const isDev = require('electron-is-dev');


console.log(process.env.NODE_ENV)
if (process.env.ELECTRON_IS_DEV !== 'production') {
    require('dotenv').config();
  }

  if (isDev) {
	console.log('Running in development');
} else {
	console.log('Running in production');
}

async function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
            
        }
    })

    win.loadFile('index.html');

    win.once('ready-to-show', () => {     
        console.log('checkin for updates')  
       autoUpdater.checkForUpdatesAndNotify();
    });
    
   
    
    
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() })
})

autoUpdater.on('update-available', () => {
    console.log('update_available!');
    mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
    console.log('update_downloaded!');
    mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', ()=>{
    autoUpdater.quitAndInstall();
})