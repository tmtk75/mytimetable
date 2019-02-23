<template>
  <v-content>
    <v-container ma-0 pa-0>
      <v-app>
        <nuxt/>
      </v-app>
    </v-container>
  </v-content>
</template>


<script lang="ts">
import {Vue, Component, Action} from 'nuxt-property-decorator'

@Component
export default class extends Vue {
  @Action("load")
  load: any

  created() {
    this.load();
  } 
}
</script>
