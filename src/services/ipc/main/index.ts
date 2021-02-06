import { BrowserWindow, ipcMain, IpcMainEvent, IpcRendererEvent } from 'electron'
import { AllAlbumsChannel, AllSongsChannel } from './songs'
import { ScannerChannel } from './scanner'
import { v4 } from 'uuid'

export var workerWindow: BrowserWindow | null

export function registerIpcChannels(worker: BrowserWindow | null) {
  workerWindow = worker
  const ipcChannels = [new AllSongsChannel(), new AllAlbumsChannel(), new ScannerChannel()]
  ipcChannels.forEach((channel) => ipcMain.on(channel.name, (event, request) => channel.handle(event, request)))
}

export interface IpcRequest {
  responseChannel?: string
  params?: any
  appPath?: string
}

export interface IpcChannelInterface {
  name: string
  handle(event: IpcMainEvent | IpcRendererEvent, request: IpcRequest): void
}

export function sendToWorker<T>(channel: string, request: IpcRequest = {}): Promise<T | void> {
  if (workerWindow) {
    if (!request.responseChannel) {
      request.responseChannel = v4()
    }
    workerWindow.webContents.send(channel, request)

    return new Promise((resolve) => {
      ipcMain.once(request.responseChannel!, (event, response) => resolve(response))
    })
  }
  return new Promise((resolve) => resolve())
}
