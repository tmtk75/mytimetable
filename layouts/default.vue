<template>
  <v-content>
    <v-container ma-0 pa-0>
      <v-app>
        <nuxt/>
      </v-app>

      <v-footer fixed app>
        <v-layout justify-center align-center class="caption">
          <div>copyright 2019 tmtk75</div>
          <a href="https://github.com/tmtk75/mytimetable" target="github" class="no-decoratoration">
            <v-icon>mdi-github-box</v-icon>
          </a>
        </v-layout>
      </v-footer>
    </v-container>
  </v-content>
</template>


<style scoped>
.toolbar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.no-decoratoration {
  text-decoration: none;
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
