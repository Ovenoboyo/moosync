import { IpcChannelInterface, sendToWorker, workerWindow } from '.'
import { IpcEvents } from './constants'
import { app, IpcMainEvent } from 'electron'
import { IpcRequest } from './index'
import { MusicScanner } from '../../files/scanner'
import path from 'path'

export var isScanning: Boolean = false

export class ScannerChannel implements IpcChannelInterface {
  name = IpcEvents.SCAN_MUSIC

  handle(event: IpcMainEvent, request: IpcRequest) {
    if (request.params) {
      if (workerWindow) {
        request.appPath = path.join(app.getPath('appData'), app.getName())
        console.log(request)
        sendToWorker(IpcEvents.SCAN_MUSIC_WORKER, request)
      }
    }
  }
}
