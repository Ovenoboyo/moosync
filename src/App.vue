<template>
  <div id="app" :style="rootColors">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { ThemesModule } from '@/store/themeState'

import { Playlist } from '@/models/playlists'
import { IpcEvents } from '@/services/ipc/main/constants'
import { IpcRendererHolder } from '@/services/ipc/renderer'

import { playlistInfo, PlaylistModule } from '@/store/playlists'
import { ipcRenderer } from 'electron'
import { Component, Vue } from 'vue-property-decorator'

const stun = require('stun')

@Component({})
export default class App extends Vue {
  private root = document.documentElement
  get rootColors() {
    return ThemesModule.rootVars
  }

  private setDefaultTheme() {
    ThemesModule.setRootVars({
      '--primary': '#212121',
      '--secondary': '#282828',
      '--tertiary': '#202730',
      '--quaternary': '#404040',
      '--textPrimary': '#ffffff',
      '--textPrimaryTransparent': '#ffffff03',
      '--textSecondary': '#565656',
      '--accentPrimary': '#65CB88',
    })
  }

  mounted() {
    this.registerThemeListeners()
    this.setDefaultTheme()
    this.watchPlaylistUpdates()
    this.populatePlaylists()

    // this.testStun()
    // this.IpcHolder.send<void>(IpcEvents.SCAN_MUSIC, { params: ['/mnt/g/songs/Playlist/Daily Dose'] }).then((data) => {
    //   console.log(data)
    // })
  }

  private IpcHolder = new IpcRendererHolder(ipcRenderer)

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

  private registerThemeListeners() {
    ThemesModule.$watch(
      (themesModule) => themesModule.rootVars,
      async (newColors: { [key: string]: string }) => {
        this.root.style.setProperty('--primary', newColors['--primary'])
      }
    )
  }

  private watchPlaylistUpdates() {
    PlaylistModule.$watch(
      (playlistModule) => playlistModule.updated,
      (updated: boolean) => {
        if (updated) {
          PlaylistModule.setUpdated(false)
          this.populatePlaylists()
        }
      }
    )
  }

  private populatePlaylists() {
    this.IpcHolder.send<Playlist[]>(IpcEvents.GET_PLAYLISTS).then((data) => {
      let playlists: playlistInfo = {}
      for (let p of data) {
        playlists[p.playlist_id] = p.playlist_name
      }
      PlaylistModule.setPlaylists(playlists)
    })
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background: var(--primary);
  color: var(--textPrimary);
  width: 100%;
  height: 100%;
  /* margin-top: 60px; */
}

body {
  background-color: var(--primary) !important;
  color: var(--textPrimary) !important;
}
</style>
