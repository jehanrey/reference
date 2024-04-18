import dayjs, { type Dayjs } from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { useMemo } from 'react'

import { rotate } from '../../utils/array'

import { DAYS_OF_WEEK } from './constants'
import { type DayOfWeek } from './types'
import { getDays, getWeeks } from './utils'

dayjs.extend(weekOfYear)

export interface Props {
  startOfWeek?: DayOfWeek
  current?: Dayjs
  selection?: 'date' | 'week'
  onClick?: (dayjs: Dayjs) => void
}

const WeekCalendar = ({
  current = dayjs(),
  startOfWeek = 0,
  onClick,
}: Props) => {
  const days = useMemo(
    () => getDays({ current, startOfWeek }),
    [current, startOfWeek],
  )
  const weeks = useMemo(
    () => getWeeks({ current, startOfWeek }),
    [current, startOfWeek],
  )
  const daysOfWeek = ['', ...rotate(DAYS_OF_WEEK, startOfWeek)]
  return (
    <div className="relative overflow-clip">
      <div className="grid grid-cols-8">
        {daysOfWeek.map((day) => (
          <span key={day} className="aspect-square p-[6px]">
            {day}
          </span>
        ))}
      </div>
      {weeks.map((week) => {
        const weekNumber = week.at(0)?.week()
        return (
          <button
            key={week.toString()}
            className="group grid w-full grid-cols-8 hover:bg-primary"
            onClick={() => onClick?.(week[0])}
          >
            <span className="flex aspect-square items-center justify-center p-[6px] text-[10px] text-gray-400">{`W${weekNumber}`}</span>
            {week.map((day) => {
              const sameMonth = day.isSame(current, 'month')
              if (!sameMonth) return <div key={day.toString()} />
              return (
                <span
                  key={day.toString()}
                  className="flex aspect-square items-center justify-center p-[6px] group-hover:text-white"
                >
                  {day.format('D')}
                </span>
              )
            })}
          </button>
        )
      })}
    </div>
  )
}

export default WeekCalendar
