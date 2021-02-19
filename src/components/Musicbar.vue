<template>
  <div class="background w-100">
    <b-progress class="w-100 timeline" :max="currentSong ? currentSong.duration : 0">
      <b-progress-bar :value="timestamp" variant="success"></b-progress-bar>
    </b-progress>
    <b-container fluid class="d-flex h-100">
      <b-row class="flex-grow-1 justify-content-between">
        <b-col col lg="3"
          ><Details
            :title="currentSong ? currentSong.title : '-'"
            :artists="currentSong ? currentSong.artists : []"
            :cover="
              currentSong && currentSong.album && currentSong.album.album_coverPath
                ? currentSong.album.album_coverPath
                : ''
            "
            :coverBlob="currentCoverBlob"
        /></b-col>
        <b-col col lg="auto"
          ><Controls :duration="currentSong ? currentSong.duration : 0" :timestamp="timestamp"
        /></b-col>
        <b-col col lg="3"><ExtraControls /></b-col>
      </b-row>
    </b-container>
    <AudioStream :playerState="playerState" :currentSong="currentSong" @onTimeUpdate="updateTimestamp" />
  </div>
</template>

<script lang="ts">
import AudioStream from '@/components/AudioStream.vue'
import Controls from '@/components/musicbar/Controls.vue'
import Details from '@/components/musicbar/Details.vue'
import ExtraControls from '@/components/musicbar/ExtraControls.vue'

import { Song } from '@/models/songs'
import { PlayerModule, PlayerState } from '@/store/playerState'
import { SyncModule } from '@/store/syncState'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    Details,
    Controls,
    ExtraControls,
    AudioStream,
  },
})
export default class MusicBar extends Vue {
  private currentSong: Song | null = null
  private timestamp: number = 0
  private currentCoverBlob: Blob | null = null

  private playerState: PlayerState = PlayerState.STOPPED

  mounted() {
    this.registerSongInfoListeners()
    this.registerSyncInfoListeners()
  }

  private registerSongInfoListeners() {
    PlayerModule.$watch(
      (playerModule) => playerModule.currentSong,
      (newSong: Song | null) => {
        this.currentSong = newSong
      }
    )

    PlayerModule.$watch(
      (playerModule) => playerModule.playerState,
      async (newState: PlayerState) => {
        this.playerState = newState
      }
    )
  }

  private registerSyncInfoListeners() {
    // TODO: Decide when to play local or remote track
    SyncModule.$watch(
      (syncModule) => syncModule.currentSongDets,
      (newSong: Song | null) => {
        this.currentSong = newSong
      }
    )

    SyncModule.$watch(
      (syncModule) => syncModule.currentCover,
      async (newCover: Blob | null) => {
        this.currentCoverBlob = newCover
      }
    )
  }

  private updateTimestamp(timestamp: number) {
    this.timestamp = timestamp
  }
}
</script>

<style lang="sass" scoped>
.background
  background: var(--primary)
  position: fixed
  bottom: 0
  height: 6rem

.timeline
  background: var(--tertiary)
  height: 0.5rem

.timeline > .progress-bar
  background-color: var(--accentPrimary) !important
  transition: width 0.3s linear
</style>
