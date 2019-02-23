interface Timetable {
  tablename: string
  items: Item[]
}

interface Item {
  time: string
}

interface Config {
  hidePassedItems: boolean
}
