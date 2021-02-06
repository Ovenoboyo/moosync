import fs from 'fs'
import path from 'path'
import * as mm from 'music-metadata'
import { Song } from '@/models/songs'
import { SongDBInstance } from '../db/index'
import md5 from 'md5-file'

import Jimp from 'jimp'
import { v4 } from 'uuid'

interface image {
  path: string
  data: Buffer
}

const audioPatterns = new RegExp('.flac|.mp3|.ogg|.m4a|.webm|.wav|.wv', 'i')
async function writeBuffer(data: image) {
  return (await Jimp.read(data.data)).cover(320, 320).quality(80).writeAsync(data.path)
}

function getInfo(data: mm.IAudioMetadata, hash: string, filePath: string, coverPath?: string): Song {
  let artists: string[] = []
  if (data.common.artists) {
    for (let a of data.common.artists) {
      artists.push(...a.split(/[,&]+/))
    }
  }
  return {
    title: data.common.title ? data.common.title : path.basename(filePath),
    path: filePath,
    coverPath: coverPath,
    album: data.common.album,
    artists: artists,
    date: data.common.date,
    year: data.common.year,
    genre: data.common.genre,
    lyrics: data.common.lyrics ? data.common.lyrics[0] : undefined,
    releaseType: data.common.releasetype,
    bitrate: data.format.bitrate,
    codec: data.format.codec,
    container: data.format.container,
    duration: data.format.duration,
    sampleRate: data.format.sampleRate,
    hash: hash,
  }
}

function getCover(data: mm.IAudioMetadata, filePath: string): image | undefined {
  if (data.common.picture) {
    let coverPath = path.join(path.dirname(filePath), v4() + '.jpg')
    return {
      path: coverPath,
      data: data.common.picture[0].data,
    }
  }
}

export class MusicScanner {
  private paths: string[]
  private SongDB: SongDBInstance

  constructor(appPath: string, ...paths: string[]) {
    this.SongDB = new SongDBInstance(appPath)
    this.paths = paths
  }

  private async processFile(filePath: string) {
    const metadata = await mm.parseFile(filePath)
    const md5Sum = await this.generateChecksum(filePath)
    const cover = getCover(metadata, filePath)
    const info = getInfo(metadata, md5Sum, filePath, cover ? cover.path : undefined)
    if (cover) {
      await writeBuffer(cover)
    }
    this.storeSong(info)
    return
  }

  public start() {
    console.log('started')
    for (let i in this.paths) {
      fs.readdir(this.paths[i], (err: NodeJS.ErrnoException | null, files: string[]) => {
        console.log(err, files)
        if (!err) {
          files.forEach((file) => {
            console.log(file)
            if (audioPatterns.exec(path.extname(file)) !== null) {
              this.processFile(path.join(this.paths[i], file))
                .catch((err) => console.log('error: ' + err))
                .then(() => console.log('scanned: ' + file))
            }
          })
        }
      })
    }
  }

  private async generateChecksum(file: string): Promise<string> {
    return md5(file)
  }

  private async storeSong(info: Song) {
    const count = await this.SongDB.countByHash(info.hash)
    if (count == 0) {
      await this.SongDB.store(info)
    }
  }
}
