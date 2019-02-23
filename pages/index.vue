<template>
  <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-toolbar color="light-blue" dark>
          <v-toolbar-side-icon></v-toolbar-side-icon>
          <v-toolbar-title>My timetables</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>add</v-icon>
          </v-btn>
        </v-toolbar>

        <v-list subheader>
          <template v-for="(table, index) in tables">
            <v-subheader :key="'h'+index">
              <v-btn flat icon>
                <v-icon color="grey lighten-1">add_alarm</v-icon>
              </v-btn>
              {{ table.tablename }}
            </v-subheader>
            <template v-for="(item, index2) in table.items">
              <v-list-tile :key="'a'+index +'-' + index2">
                <v-list-tile-action/>
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.time }}</v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>{{ minLeft(item.time) }}</v-list-tile-action>
                <v-list-tile-action>
                  <v-btn icon ripple>
                    <v-icon color="grey lighten-1">delete_outline</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </template>
            <v-divider inset v-if="index + 1!= tables.length" :key="'d'+index"></v-divider>
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import moment from 'moment'
import { setTimeout, setInterval } from 'timers'

interface Table {
  tablename: string
  item: Item[]
}

interface Item {
  time: string
}

@Component
export default class extends Vue {
  tables = [
    {
      tablename: 'Bus',
      items: [
        { time: '19:25' },
        { time: '20:15' },
        { time: '20:35' },
        { time: '21:00' }
      ]
    },
    {
      tablename: 'Training',
      items: [{ time: '08:00' }]
    }
  ]

  mounted() {
    setInterval(() => {
      this.now = moment()
    }, 1000)
  }

  now: moment.Moment = moment()

  minLeft(time: string): string {
    const t = moment(time, 'HH:mm')
    // this.now = moment();
    const d = moment.duration(t.diff(this.now))
    const f = 'HH:mm:ss'
    const m = moment(`${d.hours()}:${d.minutes()}:${d.seconds()}`, f)
    return m.format(f)
  }
}
</script>
