import { GetterTree, ActionTree, MutationTree } from 'vuex'

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

export const getters: GetterTree<TimetableState, {}> = {
  timetables(state) {
    return state.timetables
  }
}

export const actions: ActionTree<TimetableState, {}> = {
  addItem(
    { commit },
    { timetable, time }: { timetable: Timetable; time: string }
  ) {
    commit('itemAdded', { timetable, time })
  }
}

export const mutations: MutationTree<TimetableState> = {
  itemAdded(
    state,
    { timetable, time }: { timetable: Timetable; time: string }
  ) {
    const t = state.timetables.find(e => e === timetable)
    if (!t) {
      return
    }
    t.items.push({ time })
    t.items.sort((a, b) => a.time.localeCompare(b.time))
  }
}
