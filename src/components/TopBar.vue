<template>
  <div class="topbar-container d-flex w-100 align-items-center">
    <b-container fluid class="d-flex">
      <b-row class="flex-grow-1 justify-content-start">
        <b-col cols="10"> <Search /> </b-col>
        <b-col cols="auto" class="my-auto"> <Navigation /> </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import Navigation from '@/components/topbar/Navigation.vue'
import Search from '@/components/topbar/Search.vue'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    Search,
    Navigation,
  },
})
export default class TopBar extends Vue {}
</script>

<style lang="sass" scoped>
.topbar-container
  background: var(--primary)
  height: 70px
  padding-left: calc(261px + 30px + 7.5px)
</style>
