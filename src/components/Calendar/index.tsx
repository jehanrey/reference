import { Dayjs } from 'dayjs'

import DayCalendar from './DayCalendar'
import MonthCalendar from './MonthCalendar'
import WeekCalendar from './WeekCalendar'
import YearCalendar from './YearCalendar'
import { Picker } from './types'

interface Props {
  picker?: Picker
  current?: Dayjs
  onClick?: (dayjs: Dayjs) => void
}

const Calendar = ({ picker, ...props }: Props) => {
  if (picker === 'year') return <YearCalendar {...props} />
  if (picker === 'month') return <MonthCalendar {...props} />
  if (picker === 'week') return <WeekCalendar {...props} />
  return <DayCalendar {...props} />
}

export default Calendar
