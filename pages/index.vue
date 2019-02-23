<template>
  <v-layout>
    <v-navigation-drawer v-model="drawer" app width="220">
      <v-list>
        <v-list-tile v-for="(item, i) in items" :to="item.to" :key="i" router exact>
          <v-list-tile-action>
            <v-icon v-html="item.icon"/>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"/>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-flex>
      <v-toolbar color="light-blue" dark app fixed>
        <v-toolbar-side-icon @click="drawer = !drawer"/>
        <v-toolbar-title>My timetables</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon @click="onAddTimetableClick">add</v-icon>
        </v-btn>
      </v-toolbar>

      <v-list subheader>
        <template v-for="(table, index) in timetables">
          <v-subheader :key="'h'+index">
            <v-layout align-center>
              <v-flex xs6 @click="onUpdateTablenameClick(table)">{{ table.tablename }}</v-flex>
              <v-flex xs6>
                <v-layout justify-end>
                  <v-btn flat icon>
                    <v-icon color="grey lighten-1" @click.stop.prevent="onAddItemClick(table)">add</v-icon>
                  </v-btn>
                  <v-btn flat icon>
                    <v-icon
                      color="grey lighten-1"
                      @click.stop.prevent="onDeleteTimetableClick(table)"
                    >delete_outline</v-icon>
                  </v-btn>
                </v-layout>
              </v-flex>
            </v-layout>
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
                  <v-icon color="grey lighten-1" @click="onDeleteItem(table, item)">remove</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </template>
          <v-divider inset v-if="index + 1!= timetables.length" :key="'d'+index"></v-divider>
        </template>
      </v-list>
    </v-flex>

    <v-dialog v-model="showTimePicker" persistent max-width="290">
      <v-card>
        <v-time-picker v-model="selectedTime" format="24hr"></v-time-picker>
        <v-card-actions>
          <v-layout justify-center>
            <v-btn flat @click="showTimePicker=false">Cancel</v-btn>
            <v-btn flat @click="showTimePicker=false; onAddItemOK()">OK</v-btn>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showOkOrCancel" persistent>
      <v-card>
        <v-card-actions>
          <v-layout justify-center>
            <v-btn flat @click="showOkOrCancel=false">Cancel</v-btn>
            <v-btn flat @click="showOkOrCancel=false; okTask()">OK</v-btn>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showTextDialog" persistent>
      <v-card>
        <v-card-text>
          <v-text-field v-model="editedText" autofocus/>
        </v-card-text>
        <v-card-actions>
          <v-layout justify-center>
            <v-btn flat @click="showTextDialog=false">Cancel</v-btn>
            <v-btn flat @click="showTextDialog=false; okAddTimetableTask()">OK</v-btn>
          </v-layout>
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

  intervalId: any = null;

  created() {
    // console.log('created')
    this.intervalId = setInterval(() => {
      this.now = moment()
    }, 1000)
    this.drawer = false;
  }

  destroyed() {
    // console.log("destroyed");
    clearInterval(this.intervalId)
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
  selectedTime = ''

  onAddItemClick(table: Timetable) {
    // this.addItem({ timetable: table, time: '12:34' })
    this.targetTimetable = table
    this.selectedTime = moment().format('HH:mm')
    this.showTimePicker = true
  }

  @Action('addItem', { namespace: 'timetable' })
  addItem: any

  onAddItemOK() {
    // console.log(this.selectedTime)
    this.addItem({ timetable: this.targetTimetable, time: this.selectedTime })
  }

  @Action('deleteItem', { namespace: 'timetable' })
  deleteItem: any

  onDeleteItem(timetable: Timetable, item: Item) {
    this.okTask = () => this.deleteItem({ timetable, item })
    this.showOkOrCancel = true
  }

  showOkOrCancel = false
  okTask: () => void = () => {}

  @Action('deleteTimetable', { namespace: 'timetable' })
  deleteTimetable: any

  onDeleteTimetableClick(timetable: Timetable) {
    this.okTask = () => this.deleteTimetable({ timetable })
    this.showOkOrCancel = true
  }

  @Action('addTimetable', { namespace: 'timetable' })
  addTimetable: any

  editedText = ''
  showTextDialog = false
  okAddTimetableTask: () => {}

  onAddTimetableClick() {
    this.okAddTimetableTask = () =>
      this.addTimetable({ timetableName: this.editedText })
    this.editedText = ''
    this.showTextDialog = true
  }

  @Action('updateTimetableName', { namespace: 'timetable' })
  updateTimetableName: any

  onUpdateTablenameClick(table: Timetable) {
    this.okAddTimetableTask = () =>
      this.updateTimetableName({
        timetable: table,
        timetableName: this.editedText
      })
    this.editedText = table.tablename
    this.showTextDialog = true
  }

  drawer = false
  items = [{ to: '/edit', icon: 'mdi-pencil-outline', title: 'Edit' }]
}
</script>
