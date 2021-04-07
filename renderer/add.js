const {
    ipcRenderer
} = require('electron')
const {
    $
} = require('./helper')
const path = require('path')

$('select-music').addEventListener('click', () => {
    ipcRenderer.send('open-music-file')
})
const renderList = (pathes) => {
    const musicList = $('musicList')
    const musicListHtml = pathes.reduce((html, music) => {
        console.log(path.basename(music));
        return html += `<li class="list-group-item">${path.basename(music)}</li>`
    }, '')
    musicList.innerHTML = `<ul class="list-group">${musicListHtml}</ul>`
}
ipcRenderer.on('selected-files', (event, files) => {
    const {
        filePaths
    } = files
    if (Array.isArray(filePaths)) {
        renderList(filePaths)
    }
})