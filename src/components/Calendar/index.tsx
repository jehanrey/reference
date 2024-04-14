import { Dayjs } from 'dayjs'

import DayCalendar from './DayCalendar'
import MonthCalendar from './MonthCalendar'
import WeekCalendar from './WeekCalendar'
import YearCalendar from './YearCalendar'
import { View } from './types'

interface Props {
  view?: View
  onClick?: (dayjs: Dayjs) => void
}

const Calendar = ({ view, ...props }: Props) => {
  if (view === 'year') return <YearCalendar {...props} />
  if (view === 'month') return <MonthCalendar {...props} />
  if (view === 'week') return <WeekCalendar {...props} />
  return <DayCalendar {...props} />
}

export default Calendar
