<template>
  <div class="appContainer">
    <!-- <button v-on:click="toggleBroadcaster()">Broadcaster</button>
    <button v-on:click="toggleWatcher()">Watcher</button> -->
    <TopBar class="topbar" />
    <AudioStream class="musicbar" :isBroadcaster="!watcher" :audioType="audioType" />
    <Sidebar class="sidebar" />
    <div class="d-flex main-content">
      <transition name="slide-fade">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import AudioStream from '@/components/AudioStream.vue'
import Sidebar from '@/components/Sidebar.vue'
import TopBar from '@/components/TopBar.vue'
import { AudioType } from '@/store/playerState'
import { IpcRendererHolder } from '@/services/ipc/renderer'
import { ipcRenderer } from 'electron'
// eslint-disable-next-line no-unused-vars
import { Song } from '@/models/songs'
import { IpcEvents } from '@/services/ipc/main/constants'

const stun = require('stun')

@Component({
  components: {
    AudioStream,
    Sidebar,
    TopBar,
  },
})
export default class MainComponent extends Vue {
  private watcher: Boolean = true
  private audioType: number = AudioType.LOCAL
  private IpcHolder = new IpcRendererHolder(ipcRenderer)

  mounted() {
    this.testStun()
    this.IpcHolder.send<void>(IpcEvents.SCAN_MUSIC, { params: ['/mnt/g/songs/Playlist/Daily Dose'] })
  }

  public toggleWatcher() {
    this.watcher = true
  }
  public toggleBroadcaster() {
    this.watcher = false
  }

  public testStun(): void {
    stun.request('stun.l.google.com:19302', (err: any, res: any) => {
      if (err) {
        console.error(err)
      } else {
        const { address } = res.getXorAddress()
        console.log('ip: ', address)
      }
    })
  }
}
</script>

<style lang="sass" scoped>

.musicbar
  position: fixed
  z-index: -1

.sidebar
  position: fixed
  z-index: -2

.topbar
  position: fixed
  z-index: -3

.main-content
  position: absolute
  left: calc(261px + 30px)
  right: 30px
  top: 70px
  bottom: calc(6rem + 30px)
  height: calc(100% - (6rem + 30px) - 70px)
  overflow-y: scroll
  z-index: -4
</style>

<style lang="sass">
.slide-fade-enter-active
  transition: all .3s ease

.slide-fade-leave-active
  transition: all .2s ease
.slide-fade-enter, .slide-fade-leave-to
  transform: translateY(100px)
  opacity: 0

*::-webkit-scrollbar,
*::-webkit-scrollbar-thumb
  width: 26px
  border-radius: 13px
  background-clip: padding-box
  border: 10px solid transparent

*::-webkit-scrollbar-thumb
  box-shadow: inset 0 0 0 10px

*::-webkit-scrollbar-track
  margin-top: calc( 0.75rem * 2 + 18px)
  background: var(--primary)
</style>

<style lang="sass"></style>
