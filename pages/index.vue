<template>
  <v-layout>
    <v-flex>
      <v-toolbar color="light-blue" dark>
        <v-toolbar-side-icon></v-toolbar-side-icon>
        <v-toolbar-title>My timetables</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>add</v-icon>
        </v-btn>
      </v-toolbar>

      <v-list subheader>
        <template v-for="(table, index) in timetables">
          <v-subheader :key="'h'+index">
            <v-btn flat icon>
              <v-icon color="grey lighten-1" @click="onAddItemClick(table)">add_alarm</v-icon>
            </v-btn>
            {{ table.tablename }}
          </v-subheader>
          <template v-for="(item, index2) in table.items">
            <v-list-tile
              :key="'a'+index +'-' + index2"
              :class="!isPassed(item.time) ? 'on-time' : 'passed'"
            >
              <v-list-tile-action/>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.time }}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <template v-if="!isPassed(item.time)">{{ minLeft(item.time) }}</template>
                <template v-else>Passed</template>
              </v-list-tile-action>
              <v-list-tile-action>
                <v-btn icon ripple>
                  <v-icon color="grey lighten-1">delete_outline</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </template>
          <v-divider inset v-if="index + 1!= timetables.length" :key="'d'+index"></v-divider>
        </template>
      </v-list>
    </v-flex>

    <v-dialog v-model="showTimePicker" max-width="290">
      <v-card>
        <v-time-picker v-model="selectedTime" format="24hr"></v-time-picker>
        <v-card-actions>
          <v-btn flat @click="showTimePicker=false">Cancel</v-btn>
          <v-btn flat @click="showTimePicker=false; onAddItemOK()">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>


<style scoped>
.passed {
  background-color: lightgray;
  color: gray;
}
</style>


<script lang="ts">
import { Vue, Component, State, Getter, Action } from 'nuxt-property-decorator'
import moment from 'moment'

@Component
export default class extends Vue {
  @Getter('timetables', { namespace: 'timetable' })
  timetables: Timetable[]

  @State('colors', { namespace: 'color' })
  colors: any

  mounted() {
    setInterval(() => {
      this.now = moment()
    }, 1000)
  }

  now: moment.Moment = moment()

  minLeft(time: string): string {
    const d = this.duration(time)
    const f = 'HH:mm:ss'
    const m = moment(`${d.hours()}:${d.minutes()}:${d.seconds()}`, f)
    return m.format(f)
  }

  duration(time: string) {
    const t = moment(time, 'HH:mm')
    return moment.duration(t.diff(this.now))
  }

  isPassed(time: string) {
    return this.duration(time).asSeconds() < 0
  }

  targetTimetable: Timetable | null = null
  showTimePicker = false
  selectedTime = moment().format('HH:mm')

  onAddItemClick(table: Timetable) {
    // this.addItem({ timetable: table, time: '12:34' })
    this.targetTimetable = table
    this.showTimePicker = true
  }

  onAddItemOK() {
    // console.log(this.selectedTime)
    this.addItem({ timetable: this.targetTimetable, time: this.selectedTime })
  }

  @Action('addItem', { namespace: 'timetable' })
  addItem: any
}
</script>
