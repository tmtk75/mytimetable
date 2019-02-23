import { ActionTree } from 'vuex'

export const actions: ActionTree<{}, {}> = {
  load({dispatch}) {
    // console.log('load')
    dispatch("timetable/loadTimetables");
  }
}
