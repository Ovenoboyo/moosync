import { Player } from './player'
import YTPlayer from 'yt-player'
export class YoutubePlayer extends Player {
  playerInstance: YTPlayer

  constructor(playerInstance: YTPlayer) {
    super()
    this.playerInstance = playerInstance
  }

  load(src?: string, volume?: number): void {
    src ? this.playerInstance.load(src) : null
    volume ? (this.volume = volume) : null
  }

  async play(): Promise<void> {
    this.playerInstance.play()
    return
  }

  pause(): void {
    return this.playerInstance.pause()
  }

  stop(): void {
    return this.playerInstance.stop()
  }

  get currentTime(): number {
    return this.playerInstance.getCurrentTime()
  }

  set currentTime(time: number) {
    this.playerInstance.seek(time)
  }

  get volume(): number {
    return this.playerInstance.getVolume()
  }

  set volume(volume: number) {
    this.playerInstance.setVolume(volume)
  }

  protected listenOnEnded(): void {
    this.playerInstance.on('ended', this.onEndedCallback!)
  }

  protected listenOnTimeUpdate(): void {
    this.playerInstance.on('timeupdate', this.onTimeUpdateCallback!)
  }

  protected listenOnLoad(): void {
    this.playerInstance.on('cued', this.onLoadCallback!)
  }

  removeAllListeners(): void {
    this.playerInstance.removeAllListeners()
  }
}