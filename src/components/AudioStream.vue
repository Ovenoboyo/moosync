<template>
  <div>
    <div ref="audioHolder">
      <div id="yt-player" class="yt-player"></div>
      <audio ref="audio" controls style="position: absolute; top: 100px" />
    </div>
    <MusicBar :currentSong="currentSong" :timestamp="currentTime" :currentCover="currentCover" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop } from 'vue-property-decorator'
import { SyncHolder } from '@/services/syncHandler'
import { AudioType } from '@/store/player/playerState'
import MusicBar from './audiostream/Musicbar.vue'
import { PlayerState, PlayerModule } from '@/store/player/playerState'
import YTPlayer from 'yt-player'

// eslint-disable-next-line no-unused-vars
import { CoverImg, Song } from '@/models/songs'

import fs from 'fs'
import { PeerMode, SyncModule } from '@/store/sync/syncState'

@Component({
  components: {
    MusicBar,
  },
})
export default class AudioStream extends Vue {
  private AudioType: typeof AudioType = AudioType // To access enum in template
  @Ref('audio') audioElement!: ExtendedHtmlAudioElement
  private currentTime: number = 0

  @Prop({ default: '' })
  roomID!: string

  private peerHolder = new SyncHolder()
  private playerState: PlayerState = PlayerState.STOPPED
  private isSongLoaded: boolean = false
  private currentSong: Song | null = null
  private currentCover: CoverImg | null = null
  private player: YTPlayer | undefined
  private peerMode: PeerMode = PeerMode.UNDEFINED

  mounted() {
    this.registerListeners()
    this.setupYTPlayer()
  }

  private setupYTPlayer() {
    this.player = new YTPlayer('#yt-player')
  }

  private registerPlayerListeners() {
    PlayerModule.$watch(
      (playerModule) => playerModule.currentSongDets,
      (newSong: Song | null) => {
        this.currentSong = newSong
        if (newSong) this.loadAudio(newSong.path)
      }
    )

    PlayerModule.$watch(
      (playerModule) => playerModule.currentSongCover,
      async (newCover: CoverImg | null) => {
        this.currentCover = newCover
      }
    )

    PlayerModule.$watch(
      (playerModule) => playerModule.state,
      async (newState: PlayerState) => {
        this.playerState = newState
        await this.handlePlayerState()
      }
    )

    this.$root.$on('join-room', (data: string) => this.joinRoom(data))
    this.$root.$on('create-room', () => this.createRoom())
  }

  private registerAudioListeners() {
    this.audioElement.ontimeupdate = () => (this.currentTime = this.audioElement.currentTime)
    this.audioElement.onended = () => PlayerModule.nextSong()
  }

  private registerListeners() {
    this.registerAudioListeners()
    this.registerPlayerListeners()
  }

  private unloadAudio() {
    this.audioElement.srcObject = null
    this.isSongLoaded = false
  }

  private loadAudio(filePath: string) {
    const file = fs.readFileSync(filePath)
    const fileURL = URL.createObjectURL(new Blob([file]))
    this.audioElement.src = fileURL
    this.isSongLoaded = true

    if (this.peerMode == PeerMode.BROADCASTER) {
      this.peerHolder.gotFile(file)
    }

    PlayerModule.setState(PlayerState.PAUSED)
  }

  private async handlePlayerState() {
    if (this.isSongLoaded) {
      switch (this.playerState) {
        case PlayerState.PLAYING:
          this.audioElement.play()
          break
        case PlayerState.PAUSED:
          this.audioElement.pause()
          break
        case PlayerState.STOPPED:
          this.unloadAudio()
          break
      }
    }
  }

  private joinRoom(id: string) {
    this.peerMode = PeerMode.WATCHER
    SyncModule.setMode(PeerMode.WATCHER)
    this.peerHolder.setPeerMode(PeerMode.WATCHER)
    this.peerHolder.addAudioElement(this.audioElement)
    this.peerHolder.onJoinRoom((id: string) => {
      SyncModule.setRoom(id)
      this.peerHolder.start()
    })
    this.peerHolder.joinRoom(id)
    SyncModule.setRoom(id)
  }

  private createRoom() {
    this.peerMode = PeerMode.BROADCASTER
    SyncModule.setMode(PeerMode.BROADCASTER)
    this.peerHolder.setPeerMode(PeerMode.BROADCASTER)
    this.peerHolder.addAudioElement(this.audioElement)
    this.peerHolder.onJoinRoom((id: string) => {
      SyncModule.setRoom(id)
      this.peerHolder.start()
    })
    this.peerHolder.createRoom()
    // this.setupAudioType()
    // this.holderBroadcast!.onRoomJoin((roomID: string) => SyncModule.setRoom(roomID))
    // this.holderBroadcast!.createRoom()
  }

  // private playAudio(callback: Function): void {
  //   this.getAudioFile()
  //   let stream = this.audioElement.captureStream()
  //   stream.onaddtrack = () => {
  //     callback()
  //   }
  // }

  // private switchAudio(): void {
  //   var fs = require('fs')
  //   var path = require('path')
  //   var p = path.join('/home/ovenoboyo/test2.flac')

  //   const file = fs.readFileSync(p)
  //   const fileURL = URL.createObjectURL(new Blob([file]))

  //   this.audioElement.src = fileURL
  //   let stream = this.audioElement.captureStream()
  //   stream.onaddtrack = () => {
  //     this.holderBroadcast!.gotStream(stream)
  //   }
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

<style lang="sass">
.yt-player
  width: 0
</style>
