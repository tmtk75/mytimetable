import { GetterTree, ActionTree, MutationTree } from 'vuex'

interface TimetableState {
  timetables: Timetable[]
}

export const state = (): TimetableState => ({
  timetables: []
})

export const getters: GetterTree<TimetableState, {}> = {
  timetables(state) {
    return state.timetables
  }
}

export const actions: ActionTree<TimetableState, {}> = {
  loadTimetables({ commit }) {
    commit('timetablesLoaded', {
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
  },

  addItem(
    { commit },
    { timetable, time }: { timetable: Timetable; time: string }
  ) {
    commit('itemAdded', { timetable, time })
  },

  deleteItem(
    { commit },
    { timetable, item }: { timetable: Timetable; item: Item }
  ) {
    commit('itemDeleted', { timetable, item })
  },

  deleteTimetable(
    { commit },
    { timetable, item }: { timetable: Timetable; item: Item }
  ) {
    commit('timetableDeleted', { timetable, item })
  },

  addTimetable({ commit }, { timetableName }: { timetableName: string }) {
    commit('timetableAdded', { timetableName })
  },

  updateTimetableName(
    { commit },
    {
      timetable,
      timetableName
    }: { timetable: Timetable; timetableName: string }
  ) {
    commit('timetableNameUpdated', { timetable, timetableName })
  }
}

export const mutations: MutationTree<TimetableState> = {
  timetablesLoaded(state, {timetables}: {timetables: Timetable[]}) {
    state.timetables = timetables;
  },

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
  },

  itemDeleted(
    state,
    { timetable, item }: { timetable: Timetable; item: Item }
  ) {
    const t = state.timetables.find(e => e === timetable)
    if (!t) {
      return
    }
    const i = t.items.findIndex(e => e === item)
    t.items.splice(i, 1)
  },

  timetableDeleted(state, { timetable }: { timetable: Timetable }) {
    const i = state.timetables.findIndex(e => e === timetable)
    state.timetables.splice(i, 1)
  },

  timetableAdded(state, { timetableName }: { timetableName: string }) {
    state.timetables.push({ tablename: timetableName, items: [] })
  },

  timetableNameUpdated(
    state,
    {
      timetable,
      timetableName
    }: { timetable: Timetable; timetableName: string }
  ) {
    const t = state.timetables.find(e => e === timetable)
    if (!t) {
      return
    }
    t.tablename = timetableName
  }
}
