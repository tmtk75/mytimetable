<template>
  <v-content>
    <v-container ma-0 pa-0>
      <v-app>
        <nuxt/>
      </v-app>

      <v-footer fixed app>
        <v-layout justify-center class="caption">
          <span>copyright 2019 tmtk75</span>
        </v-layout>
      </v-footer>
    </v-container>
  </v-content>
</template>


<style scoped>
.toolbar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
</style>


<script lang="ts">
import { Vue, Component, Action } from 'nuxt-property-decorator'

@Component
export default class extends Vue {
  @Action('load')
  load: any

  created() {
    this.load()
  }
}
</script>
