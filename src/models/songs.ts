export interface Song {
  _id?: string
  path: string
  coverPath: string | undefined
  size: string
  title: string
  album: string | undefined
  artists: string[] | undefined
  date: string | undefined
  year: number | undefined
  genre: string[] | undefined
  lyrics: string | undefined
  releaseType: string[] | undefined
  bitrate: number | undefined
  codec: string | undefined
  container: string | undefined
  duration: number | undefined
  sampleRate: number | undefined
  hash: string | undefined
  inode: string
  deviceno: string
}

export interface marshaledSong {
  _id: string
  path: string
  coverPath: string | undefined
  size: string
  title: string
  album: string | undefined
  lyrics: string | undefined
  artist_name?: string
  artists_id?: string
  genre_name?: string
  genere_id?: string
  date: string | undefined
  year: number | undefined
  bitrate: number | undefined
  codec: string | undefined
  container: string | undefined
  duration: number | undefined
  sampleRate: number | undefined
  hash: string | undefined
  inode: string
  deviceno: string
}

export interface stats {
  path: string
  size: string
  inode: string
  deviceno: string
}
