/**
 * Modules and variables
 */
const {app, dialog, BrowserWindow, Menu, MenuItem, ipcMain, nativeTheme, globalShortcut, session} = require('electron')
const path = require('path')

const {autoUpdater} = require("electron-updater");


const aboutMessage = `CPPS Client v${app.getVersion()}
Created by Allinol and Random based in Coastal Freeze Client.
Modified by Junji.
Made with Love
Owners of Coastal Freeze: Fliberjig1 and Snickerdoodle
Project BomberCraft Admin: Junji`;

const boutMessage = `Made with Love. Danrio & Junji.`;


/**
 * This switch case will return the correct DLL/so/plugin for the app
 */
let pluginName
switch (process.platform) {
	case 'win32':
		imageName = 'windows_icon';
		switch (process.arch) {
			case 'ia32':
			case 'x32':
				pluginName = 'flash/windows/32/pepflashplayer.dll'
				break
			case 'x64':
				pluginName = 'flash/windows/64/pepflashplayer.dll'
				break
			}
		break
	case 'linux':
		imageName = 'linux_icon';
		switch (process.arch) {
			case 'ia32':
			case 'x32':
				pluginName = 'flash/linux/32/libpepflashplayer.so'
				break
			case 'x64':
				pluginName = 'flash/linux/64/libpepflashplayer.so'
				break
			}
		
		app.commandLine.appendSwitch('no-sandbox');
		break
	case 'darwin':
		imageName = 'mac_os_icon';
		pluginName = 'flash/mac/PepperFlashPlayer.plugin'
		break
}
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginName));
app.commandLine.appendSwitch("disable-http-cache");



/**
 * creates the loading screen
 * @returns {void}
 */
let loadingScreen;
function createLoadingScreen(){
  /// create a browser mainWindow
  
  loadingScreen = new BrowserWindow({
      /// define width and height for the mainWindow
      width: 200,
      height: 300,
      /// remove the mainWindow frame, so it will become a frameless mainWindow
      frame: false,
      /// and set the transparency, to remove any mainWindow background color
      transparent: true
    }
  );
  if(mainWindow) mainWindow.close()
  loadingScreen.setResizable(false);
  loadingScreen.loadURL(
    'file://' + __dirname + '/window/loading.html'
  );
  loadingScreen.on('closed', () => (loadingScreen = null));
  loadingScreen.webContents.on('did-finish-load', () => {
	createWindow();
	mainWindow.webContents.on('did-finish-load', () => {
		if(loadingScreen) loadingScreen.close()
		mainWindow.show()
	})
  });
};
/**
 * Creates the Menu Bar
 * @returns {Menu}
 */
function createMenu() { 
    fsmenu = new Menu();
    if (process.platform == 'darwin') {
        fsmenu.append(new MenuItem({
            label: "CPPS Client",
            submenu: [{
                    label: 'About',
                    click: () => {
                        dialog.showMessageBox({
                            type: "info",
                            buttons: ["Ok"],
                            title: "About Client",
                            message: aboutMessage
                        });
                    }
                },
                {
                    label: 'Fullscreen (Ctrl+F)',
                    accelerator: 'CmdOrCtrl+F',
                    click: () => {
                        mainWindow.setFullScreen(!mainWindow.isFullScreen());
                        mainWindow.webContents.send('fullscreen', mainWindow.isFullScreen());
                    }
                },
                {
                    label: 'Mute Audio (Ctrl+M)',
					accelerator: 'CmdOrCtrl+M',
                    click: () => {
                        mainWindow.webContents.audioMuted = !mainWindow.webContents.audioMuted;
                        mainWindow.webContents.send('muted', mainWindow.webContents.audioMuted);
                    }
                },
                {
                    label: '.',
                    click: () => {
                        dialog.showMessageBox({
                            type: "info",
                            buttons: ["Ok"],
                            title: "'Bout Love",
                            message: boutMessage
                        });
                    }
                },
                {
                    label: 'Vanilla',
					click: () => goToVanilla()
                },
                {
                    label: 'Legacy',
					click: () => goToLegacy()
                }
            ]
        }));
    } else {
        fsmenu.append(new MenuItem({
            label: 'About',
            click: () => {
                dialog.showMessageBox({
                    type: "info",
                    buttons: ["Ok"],
                    title: "About Client",
                    message: aboutMessage
                });
            }
        }));
        fsmenu.append(new MenuItem({
            label: 'Fullscreen (Ctrl+F)',
            accelerator: 'CmdOrCtrl+F',
            click: () => {
                mainWindow.setFullScreen(!mainWindow.isFullScreen());
            }
        }));
        fsmenu.append(new MenuItem({
            label: 'Mute Audio (Ctrl+M)',
			accelerator: 'CmdOrCtrl+M',
            click: () => {
                mainWindow.webContents.audioMuted = !mainWindow.webContents.audioMuted;
                mainWindow.webContents.send('muted', mainWindow.webContents.audioMuted);
            }
        fsmenu.append(new MenuItem({
            label: '.',
            click: () => {
                dialog.showMessageBox({
                    type: "info",
                    buttons: ["Ok"],
                    title: "'Bout Love",
                    message: boutMessage
                });
            }
        }));
        fsmenu.append(new MenuItem({
            label: 'Vanilla',
            click: () => goToVanilla()
        }));
        fsmenu.append(new MenuItem({
            label: 'Legacy',
            click: () => goToLegacy()
        }));
    }
	return fsmenu
}
/**
 * creates MainWindow
 * @returns {void}
 */
let mainWindow;
function createWindow () {
  // Create the browser mainWindow.
  mainWindow = new BrowserWindow({
    useContentSize: true,
    show: false,
    title: "LU Club Penguin BCraft - Made with Love",
    webPreferences: {
	  preload: path.join(__dirname, './preload.js'),
      plugins: true,
      nodeIntegration: false,
	  webSecurity: false
    }
  })
  registerKeys()
  Menu.setApplicationMenu(createMenu());
  mainWindow.loadURL('http://new.cpbcraft.vlhs/pt');
  
}

/**
 * Go To Vanilla
 * @returns {void}
 */
function goToVanilla() {
	const ses = mainWindow.webContents.session;
	ses.clearCache().then(() => mainWindow.loadURL('http://new.cpbcraft.vlhs/pt'));
}

/**
 * Go To Legacy
 * @returns {void}
 */
function goToLegacy() {
	const ses = mainWindow.webContents.session;
	ses.clearCache().then(() => mainWindow.loadURL('http://legacy.cpbcraft.vlhs/'));
}

/**
 * Registers the Shortcuts
 * @returns {void}
 */
function registerKeys() {
	globalShortcut.register('CmdOrCtrl+Shift+I', () => {
		mainWindow.webContents.openDevTools();
	})
}

/**
 * Auto Updater and Events!
 */
 
/**
* This event will fire if update is downloaded
* @returns {void}
*/
 
let updateAv = false;
autoUpdater.on('update-downloaded', () => {
    updateAv = true;
});

/**
 * This event will fire if electron is ready
 * @returns {void}
 */

app.whenReady().then(() => {
  createLoadingScreen()
  autoUpdater.checkForUpdatesAndNotify();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createLoadingScreen()
  })
})

/**
 * This event will fire if the windows are all closed
 * @returns {void}
 */

app.on('window-all-closed', () => {
	if(updateAv) autoUpdater.quitAndInstall();
	if(process.platform !== 'darwin') app.quit();
});

/**
 * This event will fire whenever an update is available
 * @param {Object}
 * @returns {void}
 */
 
autoUpdater.on('update-available', (updateInfo) => {
	switch (process.platform) {
	case 'win32':
	    dialog.showMessageBox({
		  type: "info",
		  buttons: ["Ok"],
		  title: "Update Available",
		  message: "There is a new version available (v" + updateInfo.version + "). It will be installed when the app closes."
	    });
	    break
	case 'darwin':
	    dialog.showMessageBox({
		  type: "info",
		  buttons: ["Ok"],
		  title: "Update Available",
		  message: "There is a new version available (v" + updateInfo.version + "). Please go install it manually from the website."
	    });
	    break
	case 'linux':
	    dialog.showMessageBox({
		  type: "info",
		  buttons: ["Ok"],
		  title: "Update Available",
		  message: "There is a new version available (v" + updateInfo.version + "). Auto-update has not been tested on this OS, so if after relaunching app this appears again, please go install it manually."
	    });
	    break
	}
});

/**
 * This Event will fire if 'load:data' was sent from the site
 * @param {event}
 * @param {String}
 * @param {String}
 * @returns {void}
 */

ipcMain.on('load:data', (event, mute, theme) => {
	muted = (mute === 'true');
	nativeTheme.themeSource = theme;
	mainWindow.webContents.audioMuted = muted;
	
	mainWindow.webContents.send('theme', nativeTheme.themeSource);
	
});

/**
 * End of Auto Updater part
 */



