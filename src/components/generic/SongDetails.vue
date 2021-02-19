<template>
  <div class="w-100 image-container d-flex">
    <b-overlay :show="true" no-center opacity="0.6" blur="2px" variant="dark" class="text-container">
      <img ref="cover" v-if="imgSrc" :src="'media://' + imgSrc" alt="cover art" />
      <template #overlay>
        <div>
          <div class="text-over title">{{ currentTitle }}</div>
          <div class="text-over subtitle">{{ currentsubTitle }}</div>
        </div>
      </template>
    </b-overlay>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator'

@Component({
  components: {},
})
export default class SongDetails extends Vue {
  @Ref('cover') imageElement!: HTMLImageElement

  @Prop({ default: '' })
  private currentTitle!: string

  @Prop({ default: '' })
  private currentsubTitle!: string

  @Prop({ default: '' })
  private imgSrc!: string
}
</script>

<style lang="sass">
@import '@/sass/variables.sass'
@import "~bootstrap/scss/mixins"

img
  font-size: 0

.image-container
  position: relative
  margin-top: 15px

.image-container img
  width: 100%

.text-container > .b-overlay > .bg-dark
  background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.58), rgba(0, 0, 0, 0.58)), radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.2) 100%) !important
  background-color: #00000000 !important

.text-over
  font-family: 'Proxima Nova'
  text-align: left
  margin-left: 15px

.title
  color: var(--textPrimary)
  font-size: 2.5vw
  line-height: 32px
  @include media-breakpoint-up(md-c)
    margin-top: 12px
  @include media-breakpoint-up(lg-c)
    margin-top: 22px
  @include media-breakpoint-up(xs)
    margin-top: 8px
  @include media-breakpoint-up(xl)
    margin-top: 30px
    margin-bottom: 13px


.subtitle
  color: var(--textPrimary)
  font-weight: 250
  font-size: 1vw
  line-height: 18px
</style>
