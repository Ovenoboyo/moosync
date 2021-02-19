<template>
  <b-container fluid class="song-container">
    <b-row class="d-flex h-100">
      <b-col class="h-100" cols="8"
        ><SongList
          :songList="songList"
          :extrafields="[{ key: 'title' }, { key: 'album' }, { key: 'artists' }]"
          @onRowDoubleClicked="pushInQueue"
          @onRowContext="getSongContextMenu"
          @onRowSelected="updateCoverDetails"
      /></b-col>
      <b-col class="h-100" cols="4"
        ><SongDetails
          :currentTitle="currentSong ? currentSong.title : ''"
          :currentsubTitle="
            currentSong && currentSong.album && currentSong.album.album_name ? currentSong.album.album_name : ''
          "
          :imgSrc="
            currentSong && currentSong.album && currentSong.album.album_coverPath
              ? currentSong.album.album_coverPath
              : ''
          "
      /></b-col>
    </b-row>
    <NewPlaylistModal :id="'NewPlaylistModal'" />
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SongList from '@/components/generic/SongList.vue'
import SongDetails from '@/components/generic/SongDetails.vue'

import { Song } from '@/models/songs'
import { IpcEvents } from '@/services/ipc/main/constants'
import { IpcRendererHolder } from '@/services/ipc/renderer'
import { ipcRenderer, remote } from 'electron'
import { PlayerModule } from '@/store/playerState'
import { PlaylistModule } from '@/store/playlists'
import { getPlaylistsMenu } from '@/services/ui/contextMenu'
import NewPlaylistModal from '@/components/generic/NewPlaylistModal.vue'

@Component({
  components: {
    SongList,
    SongDetails,
    NewPlaylistModal,
  },
})
export default class AllSongs extends Vue {
  private IpcHolder = new IpcRendererHolder(ipcRenderer)
  private songList: Song[] = []
  private currentSong: Song | null = null

  get playlists() {
    return PlaylistModule.playlists
  }

  mounted() {
    this.requestSongs()
  }

  private async requestSongs() {
    this.IpcHolder.send<Song[]>(IpcEvents.GET_ALL_SONGS, { responseChannel: IpcEvents.GOT_ALL_SONGS }).then((data) => {
      this.songList = data
    })
  }

  private addSongToPlaylist(playlist_id: string, song: Song) {
    this.IpcHolder.send<void>(IpcEvents.ADD_TO_PLAYLIST, {
      responseChannel: IpcEvents.ADDED_TO_PLAYLIST,
      params: {
        playlist_id: playlist_id,
        song_ids: [song],
      },
    })
  }

  private updateCoverDetails(items: Song[]) {
    if (items) this.currentSong = items[items.length - 1]
  }

  private getSongContextMenu(item: Song) {
    let menu = new remote.Menu()
    menu.append(
      new remote.MenuItem({
        label: 'Add to playlist',
        submenu: getPlaylistsMenu(
          this.playlists,
          (p: string) => this.addSongToPlaylist(p, item),
          () => this.$bvModal.show('NewPlaylistModal')
        ),
      })
    )
    menu.popup()
  }

  private pushInQueue(item: Song) {
    PlayerModule.pushInQueue(item)
  }
}
</script>

<style lang="sass" scoped>
.song-container
  position: absolute
  height: 100%
  overflow-y: hidden
</style>
