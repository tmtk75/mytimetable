interface TimetableState {
  timetables: Timetable[]
}

export const state = (): TimetableState => ({
  timetables: [
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
})

import { GetterTree } from 'vuex'

export const getters: GetterTree<TimetableState, {}> = {
  timetables(state) {
    return state.timetables;
  }
}

export const mutations = {}
