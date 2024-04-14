import { Dayjs } from 'dayjs'

import DayCalendar from './DayCalendar'
import MonthCalendar from './MonthCalendar'
import WeekCalendar from './WeekCalendar'
import YearCalendar from './YearCalendar'
import { Level } from './types'

interface Props {
  level?: Level
  current?: Dayjs
  onClick?: (dayjs: Dayjs) => void
}

const Calendar = ({ level, ...props }: Props) => {
  if (level === 'year') return <YearCalendar {...props} />
  if (level === 'month') return <MonthCalendar {...props} />
  if (level === 'week') return <WeekCalendar {...props} />
  return <DayCalendar {...props} />
}

export default Calendar
