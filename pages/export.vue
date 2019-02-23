<template>
  <v-container>
    <v-textarea v-model="data" readonly class="mono" rows="16" label="timetables"/>
  </v-container>
</template>


<style scoped>
.mono {
  font-family: monospace;
}
</style>


<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Key } from '~/store/timetable'

@Component
export default class extends Vue {
  async asyncData({ store, params }) {
    return {
      data: localStorage.getItem(Key.timetables)
    }
  }
}
</script>
