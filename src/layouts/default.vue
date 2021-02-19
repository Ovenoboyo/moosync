<template>
  <div class="appContainer">
    <TopBar class="topbar" />
    <MusicBar class="musicbar" />
    <Sidebar class="sidebar" />
    <div class="d-flex main-content">
      <transition name="slide-fade">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import MusicBar from '@/layout/Musicbar.vue'
import Sidebar from '@/layout/Sidebar.vue'
import TopBar from '@/layout/TopBar.vue'
import { Component } from 'vue-property-decorator'
import Vue from 'vue'

@Component({
  components: {
    Sidebar,
    TopBar,
    MusicBar,
  },
})
export default class DefaultLayout extends Vue {}
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
