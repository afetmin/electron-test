const Store = require('electron-store')
const {
    v4: uuidv4
} = require('uuid')
const path = require('path')
class DataStore extends Store {
    constructor(settings) {
        super(settings)
        this.tracks = this.getTracks()
    }
    saveTracks() {
        this.set('tracks', this.tracks)
        return this
    }
    getTracks() {
        return this.get('tracks') || []
    }

    addTracks(tracks) {
        const trackWithProps = tracks.map((track) => {
            return {
                id: uuidv4(),
                path: track,
                fileName: path.basename(track)
            }
        }).filter(track => {
            const currentTrackPath = this.getTracks().map((track) => track.path)
            return currentTrackPath.indexOf(track.path) < 0
        })
        this.tracks = [...this.tracks, ...trackWithProps]
        return this.saveTracks()
    }
    deleteTracks(delID) {
        this.tracks = this.tracks.filter(track => track.id !== delID)
        return this.saveTracks()
    }
}

module.exports = DataStore