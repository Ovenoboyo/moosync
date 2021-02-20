export enum IpcEvents {
  SCAN_MUSIC = 'scanMusic',
  GET_ALL_SONGS = 'getAllSongs',
  GET_COVER = 'getCover',
  GET_ALBUMS = 'getAlbums',
  GET_ARTISTS = 'getArtists',
  GET_PLAYLISTS = 'getPlaylists',
  CREATE_PLAYLIST = 'createPlaylist',
  ADD_TO_PLAYLIST = 'AddToPlaylist',

  GOT_COVER = 'gotCover',
  GOT_ALL_SONGS = 'gotSongs',
  GOT_ALL_ALBUMS = 'gotAlbums',
  GOT_ARTISTS = 'gotArtists',
  GOT_PLAYLISTS = 'gotPlaylists',
  ADDED_TO_PLAYLIST = 'addedToPlaylist',
}

export enum EventBus {
  UPDATE_AUDIO_TIME = 'timestamp-update',
  SONG_SELECTED = 'song-select',
  COVER_SELECTED = 'cover-select',
}