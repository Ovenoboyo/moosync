export enum IpcEvents {
  SCAN_MUSIC = 'scanMusic',
  SCAN_MUSIC_WORKER = 'scanMusicWorker',
  GET_ALL_SONGS = 'getAllSongs',
  GET_COVER = 'getCover',
  GET_ALBUMS = 'getAlbums',

  GOT_COVER = 'gotCover',
  GOT_ALL_SONGS = 'gotSongs',
  GOT_ALL_ALBUMS = 'gotAlbums',
}

export enum EventBus {
  UPDATE_AUDIO_TIME = 'timestamp-update',
  SONG_SELECTED = 'song-select',
  COVER_SELECTED = 'cover-select',
}
