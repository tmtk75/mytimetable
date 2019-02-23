interface Timetable {
  tablename: string
  items: Item[]
}

interface Item {
  time: string
  title?: string
}

interface Config {
  hidePassedItems: boolean
}
