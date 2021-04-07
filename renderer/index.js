const {
    ipcRenderer
} = require('electron')
const {
    $
} = require('./helper')

let musicAudio = new Audio()
let allTracks
let currentTrack
$('add-music-button').addEventListener('click', () => {
    ipcRenderer.send('add-music-window')
})

const renderList = (tracks) => {
    const tracksList = $('tracksList')
    const tracksHtml = tracks.reduce((html, track) => {
        return html += `<li class="row music-track list-group-item d-flex justify-content-between align-items-center">
            <div class="col-10">
            <i class = "fas fa-music mr-4 text-secondary"> </i>
            <b>${track.fileName}</b>
            </div>
            <div class = "col-2">
            <i class = "fas fa-play mr-4"  data-id="${track.id}"></i>
            <i class = "fas fa-trash ml-2" data-id="${track.id}"></i>
            </div>
        </li>`
    }, '')
    const emptyHtml = `<div class="alert alert-primary">还没有添加音乐</div>`
    tracksList.innerHTML = tracks.length > 0 ? `<ul class="list-group">${tracksHtml}</ul>` : emptyHtml
}
ipcRenderer.on('get-tracks', (event, tracks) => {
    allTracks = tracks
    renderList(tracks)
})

$('tracksList').addEventListener('click', (event) => {
    event.preventDefault()
    const {
        dataset,
        classList
    } = event.target
    const id = dataset && dataset.id // 获取点击内容的id
    if (id && classList.contains('fa-play')) {
        // 有播放的歌曲且点击的id和播放的相同 继续播放
        if (currentTrack && currentTrack.id === id) {
            musicAudio.play()
        } else {
            // 播放新的歌曲，通过点击的id寻找id
            currentTrack = allTracks.find(track => track.id === id)
            musicAudio.src = currentTrack.path
            musicAudio.play()
            // 重置⏸️按钮
            const resetIcon = document.querySelector('.fa-pause')
            if (resetIcon) {
                resetIcon.classList.replace('fa-pause', 'fa-play')
            }
        }
        // 播放时按钮改变
        classList.replace('fa-play', 'fa-pause')
    } else if (id && classList.contains('fa-pause')) {
        // 点击⏸️按钮
        musicAudio.pause()
        classList.replace('fa-pause', 'fa-play')
    } else if (id && classList.contains('fa-trash')) {
        // 删除事件
        ipcRenderer.send('delete-track', id)
    }
})