<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class Sidebar extends Vue {
  created() {
    this.$router.replace('/songs')
  }
}
</script>
