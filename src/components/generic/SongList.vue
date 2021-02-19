<template>
  <div>
    <b-table
      class="custom-table-container d-flex w-100 h-100"
      table-class="custom-table"
      :items="songList"
      :fields="fields"
      sticky-header
      :no-border-collapse="true"
      selectable
      select-mode="single"
      primary-key="title"
      :key="test"
      @row-dblclicked="onRowDoubleClicked"
      @row-selected="onRowSelected"
      @row-contextmenu="onRowContext"
    >
      <template #cell(index)="data">
        {{ data.index + 1 }}
      </template>

      <template #cell(artists)="data">
        {{ data.item.artists.length != 0 ? data.item.artists.join(', ') : '-' }}
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import { Song } from '@/models/songs'
import { Resizer } from '@/services/ui/resizer'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class SongList extends Vue {
  private test: boolean = false
  private lastSelect: string = ''
  private resizer!: Resizer

  @Prop({ default: [] })
  private songList!: Song[]

  @Prop({ default: {} })
  private extrafields!: [{ key: string }]

  private fields: [{ key: string; label?: string; tdClass?: string; thClass?: string }] = [
    { key: 'index', label: 'Sr. No', tdClass: 'index-no-td', thClass: 'index-no-th' },
  ]

  created() {
    this.fields.push(...this.extrafields)
  }

  mounted() {
    this.resizer = new Resizer(document)
    window.addEventListener('resize', this.rerenderTable)
  }

  private onRowContext(item: Song) {
    this.$emit('onRowContext', item)
  }

  private onRowDoubleClicked(item: Song) {
    this.$emit('onRowDoubleClicked', item)
  }

  private onRowSelected(items: Song[]) {
    if (items[0] && items[0]._id !== this.lastSelect) {
      this.lastSelect = items[0]._id!
      this.$emit('onRowSelected', items)
    }
  }

  private sortContent(): void {
    // TODO: Sort content without b-table sort since we have table resizers
  }

  // For some reason table isn't rerendered on window size change
  private rerenderTable() {
    this.test = !this.test
    this.$nextTick().then(() => {
      this.resizer.addGrips()
    })
  }
}
</script>

<style lang="sass">
.index-no-td
  padding: 20px 0 20px 15px !important

.index-no-th > div
  padding-left: 10px

.custom-table
  color:  var(--textPrimary) !important
  table-layout: fixed
  margin-right: 10px
  min-width: 10px
  overflow-y: hidden

.custom-table > thead > tr > th
  background-color: var(--primary) !important
  color:  var(--textPrimary) !important
  border-top: 0px !important
  border-bottom: 1px solid  var(--textSecondary) !important
  text-align: left
  padding: 12px 0 12px 0 !important

.custom-table > tbody > tr > td
  border-top: 0px !important
  border-bottom: 1px solid var(--textSecondary) !important
  text-align: left
  padding: 20px 0 20px 0

.custom-table > tbody > tr > td , .custom-table > thead > tr > th > div
  white-space: nowrap
  text-overflow: ellipsis
  overflow: hidden
  user-select: none
  font-family: 'Proxima Nova'

.custom-table > tbody > tr > td > div
  font-size: 16px
  line-height: 170.19%

.custom-table > thead > tr > th > div
  font-weight: bold
  font-size: 18px
  line-height: 167.19%

table.b-table > thead > tr > th[aria-sort="ascending"],
table.b-table > tfoot > tr > th[aria-sort="ascending"]
  background-image: none !important
  padding-right: 0px !important

table.b-table > thead > tr > th[aria-sort="descending"],
table.b-table > tfoot > tr > th[aria-sort="descending"]
  background-image: none !important
  padding-right: 0px !important


.custom-table-container
  transition: color .3s ease
  color: rgba(0, 0, 0, 0)
  max-height: calc( 100vh - 6.5rem - 30px - 30px) !important
  overflow-y: auto
  overflow-x: hidden

.custom-table-container:hover
  color: var(--textPrimary)

.custom-table-container > table
  width: 100%
</style>
