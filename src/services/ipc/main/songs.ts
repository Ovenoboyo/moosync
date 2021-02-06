import { SongDBInstance } from '@/services/db'
import { app } from 'electron'
import { IpcChannelInterface, IpcRequest } from '.'
import { IpcEvents } from './constants'

export class AllSongsChannel implements IpcChannelInterface {
  name = IpcEvents.GET_ALL_SONGS
  handle(event: Electron.IpcMainEvent, request: IpcRequest): void {
    new SongDBInstance(app.getPath('appData'))
      .getAllSongs()
      .then((data) => event.reply(request.responseChannel, data))
      .catch((e) => console.log(e))
  }
}

export class AllAlbumsChannel implements IpcChannelInterface {
  name = IpcEvents.GET_ALBUMS
  handle(event: Electron.IpcMainEvent, request: IpcRequest): void {
    new SongDBInstance(app.getPath('appData'))
      .getAllAlbums()
      .then((data) => {
        event.reply(request.responseChannel, data)
      })
      .catch((e) => console.log(e))
  }
}
