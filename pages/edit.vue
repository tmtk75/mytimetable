<template>
  <v-container>
    <v-layout justify-space-between>
      <v-btn icon to="/">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-btn icon @click="onSaveClick">
        <v-icon>save_alt</v-icon>
      </v-btn>
    </v-layout>

    <v-textarea v-model="data" class="mono" rows="16" label="timetables"/>

    <v-dialog v-model="showOkOrCancel" persistent>
      <v-card>
        <v-card-actions>
          <v-layout justify-center>
            <v-btn flat @click="showOkOrCancel=false; cancelTask()">Cancel</v-btn>
            <v-btn flat @click="showOkOrCancel=false; okTask()">OK</v-btn>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :timeout="2000">
      <v-layout justify-center>{{ snackbarText}}</v-layout>
    </v-snackbar>
  </v-container>
</template>


<style scoped>
.mono {
  font-family: monospace;
  font-size: 9pt;
}
</style>


<script lang="ts">
import { Vue, Component, Action } from 'nuxt-property-decorator'
import { Key } from '~/store/timetable'

@Component
export default class extends Vue {
  data: string = ''

  async asyncData({ store, params }) {
    return {
      data: localStorage.getItem(Key.timetables)
    }
  }

  @Action('load')
  load: any

  onSaveClick() {
    this.okTask = () => {
      localStorage.setItem(Key.timetables, this.data)
      this.load()
      this.snackbarText = 'Saved'
      this.snackbar = true
    }
    this.cancelTask = () => {
      this.snackbarText = 'Canceled'
      this.snackbar = true
    }
    this.showOkOrCancel = true
  }

  snackbar = false
  snackbarText = ''
  showOkOrCancel = false
  okTask: () => void = () => {}
  cancelTask: () => void = () => {}
}
</script>
