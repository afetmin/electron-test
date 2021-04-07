const {
    ipcRenderer
} = require('electron')
const {
    $,
    formatTime
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

const renderPlayer = (name, duration) => {
    const player = $('player-status')
    const html = `<div class="col-auto mr-auto font-weight-bold">
                正在播放: ${name}
                </div>
                <div class="col-auto">
                <span id="current-seeker">00:00</span> / ${formatTime(duration)}
                </div>
                    `
    player.innerHTML = html
}

const renderProgress = (currentTime, duration) => {
    const progress = Math.floor(currentTime / duration * 100)
    const bar = $('player-progress')
    bar.innerHTML = progress + '%'
    bar.style.width = progress + '%'
    const seeker = $('current-seeker')
    seeker.innerHTML = formatTime(currentTime)
}
ipcRenderer.on('get-tracks', (event, tracks) => {
    allTracks = tracks
    renderList(tracks)
})

musicAudio.addEventListener('loadedmetadata', () => {
    // 播放器状态
    renderPlayer(currentTrack.fileName, musicAudio.duration)
})

musicAudio.addEventListener('timeupdate', () => {
    // 更新播放器状态
    renderProgress(musicAudio.currentTime, musicAudio.duration)
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