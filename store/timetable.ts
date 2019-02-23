import { GetterTree, ActionTree, MutationTree } from 'vuex'

interface TimetableState {
  timetables: Timetable[]
}

export enum Key {
  timetables = 'timetables'
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
  loadTimetables({ commit, state }) {
    const timetables = JSON.parse(localStorage.getItem(Key.timetables) || '[]')
    commit('timetablesLoaded', { timetables })
  },

  addItem(
    { commit, state },
    { timetable, time }: { timetable: Timetable; time: string }
  ) {
    commit('itemAdded', { timetable, time })
    saveTimetables(state.timetables)
  },

  deleteItem(
    { commit, state },
    { timetable, item }: { timetable: Timetable; item: Item }
  ) {
    commit('itemDeleted', { timetable, item })
    saveTimetables(state.timetables)
  },

  deleteTimetable(
    { commit, state },
    { timetable, item }: { timetable: Timetable; item: Item }
  ) {
    commit('timetableDeleted', { timetable, item })
    saveTimetables(state.timetables)
  },

  addTimetable(
    { commit, state },
    { timetableName }: { timetableName: string }
  ) {
    commit('timetableAdded', { timetableName })
    saveTimetables(state.timetables)
  },

  updateTimetableName(
    { commit, state },
    {
      timetable,
      timetableName
    }: { timetable: Timetable; timetableName: string }
  ) {
    commit('timetableNameUpdated', { timetable, timetableName })
    saveTimetables(state.timetables)
  },

  moveUpTimetable({ commit, state }, { timetable }: { timetable: Timetable }) {
    commit('timetableMovedUp', { timetable })
    saveTimetables(state.timetables)
  }
}

export const mutations: MutationTree<TimetableState> = {
  timetablesLoaded(state, { timetables }: { timetables: Timetable[] }) {
    state.timetables = timetables
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
  },

  timetableMovedUp(state, { timetable }: { timetable: Timetable }) {
    const i = state.timetables.findIndex(e => e === timetable)
    state.timetables.splice(i, 1)
    state.timetables.splice(i - 1, 0, timetable)
  }
}

function saveTimetables(timetables: Timetable[]) {
  localStorage.setItem(Key.timetables, JSON.stringify(timetables))
}
