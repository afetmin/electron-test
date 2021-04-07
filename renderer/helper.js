exports.$ = (id) => {
    return document.getElementById(id)
}

exports.formatTime = (time) => {
    let min = Math.floor(time / 60)
    let sec = Math.floor(time - min * 60)
    min = String(min).padStart(2, 0)
    sec = String(sec).padStart(2, 0)
    return min + ':' + sec
}