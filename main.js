const {
  app,
  BrowserWindow,
  ipcMain,
  dialog
} = require('electron')
const DataStore = require('./musicDataStore')
const myStore = new DataStore({
  'name': 'Music Data'
})

let addWindow
class AppWindow extends BrowserWindow {
  constructor(config, fileLocation) {
    const basicConfig = {
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      }
    }
    const finalConfig = {
      ...basicConfig,
      ...config
    }
    super(finalConfig)
    this.loadFile(fileLocation)
    this.once('ready-to-show', () => {
      this.show()
    })
  }
}

app.on('ready', () => {
  const mainWindow = new AppWindow({}, './renderer/index.html')
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.send('get-tracks', myStore.getTracks())
  })
  ipcMain.on('add-music-window', () => {
    addWindow = new AppWindow({
      width: 600,
      height: 400,
      parent: mainWindow
    }, './renderer/add.html')
  })
  ipcMain.on('add-tracks', (event, tracks) => {
    const updateTracks = myStore.addTracks(tracks).getTracks()
    mainWindow.send('get-tracks', updateTracks)
  })
  ipcMain.on('delete-track', (event, id) => {
    const updateTracks = myStore.deleteTracks(id).getTracks()
    mainWindow.send('get-tracks', updateTracks)
  })
  ipcMain.on('open-music-file', (event) => {
    dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{
        name: 'Music',
        extensions: ['mp3', 'flac']
      }, ]
    }).then((files) => {
      if (files) {
        console.log(files);
        event.reply('selected-files', files)
      }
    })
  })
  ipcMain.on('close-add', () => {
    addWindow.hide()
  })
})