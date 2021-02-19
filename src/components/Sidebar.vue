<template>
  <b-sidebar width="261px" visible id="sidebar" no-header-close no-close-on-route-change sidebar-class="gradient">
    <template #header>
      <div class="d-flex w-100 mt-3 justify-content-between">
        <Toggle />
        <Rooms id="rooms" />
        <b-popover
          :target="`rooms`"
          placement="rightbottom"
          title="Rooms"
          triggers="focus"
          :content="`Placement hello`"
        >
          <div>
            <b-tabs content-class="mt-3">
              <b-tab title="Join" active>
                <input ref="roomid" class="inputtext" placeholder="Enter room ID" aria-label="room id" />
                <button v-on:click="joinRoom()">Join room</button>
                <h3>{{ roomID }}</h3>
              </b-tab>
              <b-tab title="Create">
                <button v-on:click="createRoom()">Create Room</button>
                <h3>{{ roomID }}</h3>
              </b-tab>
            </b-tabs>
            <div></div>
          </div>
        </b-popover>
      </div>
    </template>
    <template #default
      ><div class="extra-margin-top"><Tabs /></div>
    </template>
  </b-sidebar>
</template>

<script lang="ts">
import Rooms from '@/components/icons/Rooms.vue'
import Toggle from '@/components/icons/Toggle.vue'
import Tabs from '@/components/sidebar/Tabs.vue'
import { PeerMode, SyncModule } from '@/store/syncState'
import { Component, Ref, Vue } from 'vue-property-decorator'

@Component({
  components: {
    Toggle,
    Rooms,
    Tabs,
  },
})
export default class Sidebar extends Vue {
  @Ref('roomid')
  private roomInput!: HTMLInputElement

  private roomID: string = ''

  private setWatcher() {
    SyncModule.setMode(PeerMode.WATCHER)
  }

  private setBroadcaster() {
    SyncModule.setMode(PeerMode.BROADCASTER)
  }

  private joinRoom() {
    this.$root.$emit('join-room', this.roomInput.value)
  }

  private createRoom() {
    this.$root.$emit('create-room')
  }

  private registerListeners() {
    SyncModule.$watch(
      (syncModule) => syncModule.roomID,
      async (newState: string) => {
        this.roomID = newState
      }
    )
  }

  mounted() {
    this.registerListeners()
  }
}
</script>

<style lang="sass">
.gradient
  background: linear-gradient(176.27deg, var(--secondary) 1.69%, var(--primary) 72.01%)
  border-radius: 0px 30px 0px 0px
</style>

<style lang="sass" scoped>
.sidebar
  position: absolute

.sidebar-item
  font-family: 'Proxima Nova'

.icon-spacing
  margin-right: 26px
  padding-left: 6px

.extra-margin-top
  margin-top: 1rem
</style>
