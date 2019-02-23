<template>
  <v-container>
    <v-btn flat @click="onBackClick">Back</v-btn>
    <v-textarea v-model="data" readonly class="mono" rows="16" label="timetables"/>
  </v-container>
</template>


<style scoped>
.mono {
  font-family: monospace;
  font-size: 9pt;
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

  onBackClick() {
    ;(this as any).$router.push({ path: '/' })
  }
}
</script>
