<template>
  <b-container fluid class="album-container">
    <b-row class="title">Playlists</b-row>
    <b-row class="d-flex">
      <b-col col xl="2" md="3" v-for="playlist in playlists" :key="playlist.playlist_id">
        <CardView :title="playlist.playlist_name" :imgSrc="playlist.playlist_coverPath" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Playlist } from '@/models/playlists'
import { IpcEvents } from '@/services/ipc/main/constants'
import { IpcRendererHolder } from '@/services/ipc/renderer'
import { ipcRenderer } from 'electron'
import { Component, Vue } from 'vue-property-decorator'
import CardView from '@/components/generic/CardView.vue'

@Component({
  components: {
    CardView,
  },
})
export default class Albums extends Vue {
  private IpcHolder = new IpcRendererHolder(ipcRenderer)
  private playlists: Playlist[] = []
  private getPlaylists() {
    this.IpcHolder.send<Playlist[]>(IpcEvents.GET_PLAYLISTS, { responseChannel: IpcEvents.GOT_PLAYLISTS }).then(
      (data) => {
        this.playlists = data
      }
    )
  }

  mounted() {
    this.getPlaylists()
  }
}
</script>

<style lang="sass" scoped>
.album-container
  position: absolute
.title
  font-family: Proxima Nova
  font-style: normal
  font-weight: bold
  font-size: 64px
  line-height: 100px
  padding-left: 15px
  margin-bottom: 50px
</style>
