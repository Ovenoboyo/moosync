<template>
  <b-container fluid class="album-container">
    <b-row class="title">Artists</b-row>
    <b-row class="d-flex">
      <b-col col xl="2" md="3" v-for="artist in artistList" :key="artist.artist_id">
        <CardView :title="artist.artist_name" :imgSrc="artist.artist_coverPath" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { artists } from '@/models/artists'
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
export default class Artists extends Vue {
  private IpcHolder = new IpcRendererHolder(ipcRenderer)
  private artistList: artists[] = []
  private getArtists() {
    this.IpcHolder.send<artists[]>(IpcEvents.GET_ARTISTS, { responseChannel: IpcEvents.GOT_ARTISTS }).then((data) => {
      this.artistList = data
    })
  }

  mounted() {
    this.getArtists()
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
