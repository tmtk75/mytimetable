<template>
  <v-layout>
    <v-navigation-drawer v-model="drawer" app width="220">
      <v-list dense>
        <v-list-tile v-for="(item, i) in items" :to="item.to" :key="i" router exact>
          <v-list-tile-action>
            <v-icon v-html="item.icon"/>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"/>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-divider/>

      <v-list dense>
        <v-list-tile>
          <v-list-tile-action>
            <v-checkbox v-model="hidePassedItems"/>
          </v-list-tile-action>
          <v-list-tile-title>Hide passed items</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="onExpandAllClick(true)">
          <v-list-tile-action>
            <v-icon>keyboard_arrow_up</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Unfold all</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="onExpandAllClick(false)">
          <v-list-tile-action>
            <v-icon>keyboard_arrow_down</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Fold all</v-list-tile-title>
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

      <v-list dense expand v-if="timetables.length > 0">
        <v-list-group v-for="(table, index) in timetables" :key="'h'+index" v-model="folded[index]">
          <v-list-tile slot="activator">
            <v-layout align-center>
              <v-flex xs1 class="alarm-icon">
                <v-icon v-if="remainingClass(table)" :class="remainingClass(table)">alarm</v-icon>
                <span v-if="isAllPassed(table)">E</span>
              </v-flex>
              <v-flex
                xs5
                @click.stop.prevent="onUpdateTablenameClick(table)"
                class="text-truncate"
              >{{ table.tablename }}</v-flex>
              <v-flex xs6>
                <v-layout justify-end>
                  <v-btn icon v-if="index > 0" @click.stop.prevent="onMoveUpward(table)">
                    <v-icon color="grey lighten-1">keyboard_arrow_up</v-icon>
                  </v-btn>
                  <v-btn icon @click.stop.prevent="onAddItemClick(table)">
                    <v-icon color="grey lighten-1">add</v-icon>
                  </v-btn>
                  <v-btn icon @click.stop.prevent="onDeleteTimetableClick(table)">
                    <v-icon color="grey lighten-1">delete_outline</v-icon>
                  </v-btn>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-list-tile>

          <v-list-tile
            v-for="(item, index2) in table.items"
            :key="'a'+index +'-' + index2"
            v-if="!(isPassed(item.time) && hidePassedItems)"
            @click.stop.prevent="onUpdateItemTitleClick(table, item)"
          >
            <v-list-tile-action/>
            <v-list-tile-content>
              <v-list-tile-title>
                <v-layout>
                  <v-flex>{{ item.time }}</v-flex>
                  <v-flex>{{ item.title }}</v-flex>
                </v-layout>
              </v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action class="time">
              <span
                v-if="!isPassed(item.time)"
                class="normal"
                :class="remainingClassItem(item)"
              >{{ remainingTime(item.time) }}</span>
              <span v-else :class="{passed: isPassed(item.time)}">passed</span>
            </v-list-tile-action>
            <v-list-tile-action>
              <v-btn icon ripple>
                <v-icon
                  color="grey lighten-1"
                  @click.stop.prevent="onDeleteItem(table, item)"
                >remove</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider inset v-if="index + 1!= timetables.length" :key="'d'+index"></v-divider>
        </v-list-group>
      </v-list>
      <v-layout v-else justify-center ma-3>
        <v-btn flat @click="onAddTimetableClick">Add your timetable</v-btn>
      </v-layout>
    </v-flex>

    <v-dialog v-model="showTimePickerDialog" persistent max-width="290">
      <v-card>
        <v-time-picker v-model="pickedTime" format="24hr"></v-time-picker>
        <v-card-actions>
          <v-layout justify-center>
            <v-btn flat @click="showTimePickerDialog=false">Cancel</v-btn>
            <v-btn flat @click="showTimePickerDialog=false; timePickerDialogTask()">OK</v-btn>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showOkOrCancel" persistent>
      <v-card>
        <v-card-actions>
          <v-layout justify-center>
            <v-btn flat @click="showOkOrCancel=false">Cancel</v-btn>
            <v-btn flat @click="showOkOrCancel=false; okOrCancelDialogTask()">OK</v-btn>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showTextDialog" persistent>
      <v-card>
        <v-card-text>
          <v-text-field v-model="editedText" autofocus hide-details :label="textDialogLabel"/>
        </v-card-text>
        <v-card-actions>
          <v-layout justify-center>
            <v-btn flat @click="showTextDialog=false">Cancel</v-btn>
            <v-btn flat @click="showTextDialog=false; textDialogTask()">OK</v-btn>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>


<style lang="scss" scoped>
@mixin pill-style {
  padding: 2px 0.5rem;
  border-radius: 2px;
}

$in7mins: lighten(#03a56a, 3%);
$in5mins: lighten(#ff981a, 1%);
$in3mins: lighten(#cccc00, 1%);
$in1min: lighten(red, 33%);

.alarm-icon {
  .in7mins {
    color: $in7mins;
  }
  .in5mins {
    color: $in5mins;
  }
  .in3mins {
    color: $in3mins;
  }
  .in1min {
    color: $in1min;
  }
}

.time {
  .normal {
    @include pill-style;
  }

  .passed {
    @include pill-style;
    background-color: lightgray;
    color: gray;
  }

  .in7mins {
    @include pill-style;
    background-color: $in7mins;
  }

  .in5mins {
    @include pill-style;
    background-color: $in5mins;
  }

  .in3mins {
    @include pill-style;
    background-color: $in3mins;
  }

  .in1min {
    @include pill-style;
    background-color: $in1min;
  }
}
</style>


<script lang="ts">
import {
  Vue,
  Component,
  State,
  Getter,
  Action,
  Watch
} from 'nuxt-property-decorator'
import moment from 'moment'

enum key {
  hidePassedItems = 'hidePassedItems',
  folded = 'folded'
}

@Component
export default class extends Vue {
  @Getter('timetables', { namespace: 'timetable' })
  timetables: Timetable[]

  @State('colors', { namespace: 'color' })
  colors: any

  intervalId: any = null

  created() {
    console.log('created')
    this.intervalId = setInterval(() => {
      this.now = moment()
    }, 1000)
    this.drawer = false

    this.hidePassedItems = JSON.parse(
      localStorage.getItem(key.hidePassedItems) || 'false'
    )
  }

  destroyed() {
    // console.log("destroyed");
    clearInterval(this.intervalId)
  }

  now: moment.Moment = moment();

  remainingTime(time: string): string {
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

  isIn7mins(time: string) {
    const t = this.duration(time).asSeconds()
    return 5 * 60 < t && t < 7 * 60
  }

  isIn5mins(time: string) {
    const t = this.duration(time).asSeconds()
    return 3 * 60 < t && t < 5 * 60
  }

  isIn3mins(time: string) {
    const t = this.duration(time).asSeconds()
    return 1 * 60 < t && t < 3 * 60
  }

  isIn1min(time: string) {
    const t = this.duration(time).asSeconds()
    return 0 < t && t < 1 * 60
  }

  targetTimetable: Timetable | null = null
  showTimePickerDialog = false
  pickedTime = ''
  timePickerDialogTask: () => void = () => {}

  onAddItemClick(table: Timetable) {
    this.targetTimetable = table
    this.pickedTime = moment().format('HH:mm')
    this.timePickerDialogTask = () =>
      this.addItem({ timetable: this.targetTimetable, time: this.pickedTime })
    this.showTimePickerDialog = true
  }

  @Action('addItem', { namespace: 'timetable' })
  addItem: any

  @Action('updateItemTitle', { namespace: 'timetable' })
  updateItemTitle: any

  onUpdateItemTitleClick(timetable: Timetable, item: Item) {
    this.textDialogTask = () =>
      this.updateItemTitle({ timetable, item, title: this.editedText })
    this.editedText = item.title || ''
    this.textDialogLabel = 'Time title'
    this.showTextDialog = true
  }

  @Action('deleteItem', { namespace: 'timetable' })
  deleteItem: any

  onDeleteItem(timetable: Timetable, item: Item) {
    this.okOrCancelDialogTask = () => this.deleteItem({ timetable, item })
    this.showOkOrCancel = true
  }

  showOkOrCancel = false
  okOrCancelDialogTask: () => void = () => {}

  @Action('deleteTimetable', { namespace: 'timetable' })
  deleteTimetable: any

  onDeleteTimetableClick(timetable: Timetable) {
    this.okOrCancelDialogTask = () => this.deleteTimetable({ timetable })
    this.showOkOrCancel = true
  }

  @Action('addTimetable', { namespace: 'timetable' })
  addTimetable: any

  editedText = ''
  textDialogLabel = ''
  showTextDialog = false
  textDialogTask: () => {}

  onAddTimetableClick() {
    this.textDialogTask = () =>
      this.addTimetable({ timetableName: this.editedText })
    this.editedText = ''
    this.textDialogLabel = 'Timetable name'
    this.showTextDialog = true
  }

  @Action('updateTimetableName', { namespace: 'timetable' })
  updateTimetableName: any

  onUpdateTablenameClick(table: Timetable) {
    this.textDialogTask = () =>
      this.updateTimetableName({
        timetable: table,
        timetableName: this.editedText
      })
    this.editedText = table.tablename
    this.textDialogLabel = 'Timetable name'
    this.showTextDialog = true
  }

  drawer = false
  items = [{ to: '/edit', icon: 'mdi-pencil-outline', title: 'Edit' }]

  folded: boolean[] = JSON.parse(
    localStorage.getItem(key.folded) ||
      JSON.stringify(Array.from(Array(16).keys()).map(e => true))
  )
  @Watch('folded')
  onWatchFolded(curr, old) {
    localStorage.setItem(key.folded, JSON.stringify(this.folded))
  }

  hidePassedItems = false
  @Watch('hidePassedItems')
  watchHidePassedItems(curr, old) {
    localStorage.setItem(key.hidePassedItems, JSON.stringify(curr))
  }

  @Action('moveUpTimetable', { namespace: 'timetable' })
  moveUpTimetable: any

  onMoveUpward(table: Timetable) {
    this.moveUpTimetable({ timetable: table })
  }

  onExpandAllClick(expand: boolean) {
    this.folded = this.folded.map(e => expand)
  }

  remainingClass(table: Timetable) {
    for (let i = 0; i < table.items.length; i++) {
      const a = this.remainingClassItem(table.items[i])
      if (a.in7mins || a.in5mins || a.in3mins || a.in1min) {
        return a
      }
    }
    return null
  }

  remainingClassItem(item: Item) {
    return {
      in7mins: this.isIn7mins(item.time),
      in5mins: this.isIn5mins(item.time),
      in3mins: this.isIn3mins(item.time),
      in1min: this.isIn1min(item.time)
    }
  }

  isAllPassed(table: Timetable) {
    return table.items.map(e => this.isPassed(e.time)).reduce((a, b) => a + (b ? 0 : 1), 0) === 0
  }
}
</script>


