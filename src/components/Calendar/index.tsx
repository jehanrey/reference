import DayCalendar, { Props as DayCalendarProps } from './DayCalendar'
import MonthCalendar, { Props as MonthCalendarProps } from './MonthCalendar'
import WeekCalendar, { Props as WeekCalendarProps } from './WeekCalendar'
import YearCalendar, { Props as YearCalendarProps } from './YearCalendar'

type DayProps = {
  picker?: 'day'
} & DayCalendarProps

type WeekProps = {
  picker: 'week'
} & WeekCalendarProps

type MonthProps = {
  picker: 'month'
} & MonthCalendarProps

type YearProps = {
  picker: 'year'
} & YearCalendarProps

type Props = DayProps | WeekProps | MonthProps | YearProps

const Calendar = ({ picker, ...props }: Props) => {
  if (picker === 'year') return <YearCalendar {...props} />
  if (picker === 'month') return <MonthCalendar {...props} />
  if (picker === 'week') return <WeekCalendar {...props} />
  return <DayCalendar {...props} />
}

export default Calendar
