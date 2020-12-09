const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');



function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true

        }
    })

    win.loadFile('index.html');

    win.once('ready-to-show', async () => {
       let checkNotify = await autoUpdater.checkForUpdatesAndNotify(); 
      // let check = await autoUpdater.checkForUpdates();        
       console.log('checkNotify:',checkNotify)
       win.webContents.send('checkNotify', checkNotify);
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

autoUpdater.on('update-available', (event) => {
    win.webContents.send('update_available', event);
    event.sender.send('update_available', e);
});

autoUpdater.on('checking-for-update', (event) =>{
    console.log(event)
    //win.webContents.send('checking_for_updates', event);
    
})

autoUpdater.on('error', (e) => {    
    console.log('error',e)
});


autoUpdater.on('update-downloaded', () => {
    win.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
})