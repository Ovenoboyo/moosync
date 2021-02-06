import { ipcRenderer, IpcRendererEvent } from 'electron'
import { MusicScanner } from '../../files/scanner'
import { IpcChannelInterface, IpcRequest } from '../main'
import { IpcEvents } from '../main/constants'
export function registerIpcChannels() {
  const ipcChannels = [new ScannerChannel()]
  ipcChannels.forEach((channel) => ipcRenderer.on(channel.name, (event, request) => channel.handle(event, request)))
}

export class ScannerChannel implements IpcChannelInterface {
  name = IpcEvents.SCAN_MUSIC_WORKER

  handle(event: IpcRendererEvent, request: IpcRequest) {
    console.log('in worker')
    console.log(request.appPath)
    if (request.appPath && request.params) {
      console.log(request.params)
      const scanner = new MusicScanner(request.appPath, ...request.params)
      scanner.start()
    }
  }
}
