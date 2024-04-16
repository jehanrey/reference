import dayjs, { type Dayjs } from 'dayjs'
import { useMemo } from 'react'

import { rotate } from '../../utils/array'

import { DAYS_OF_WEEK } from './constants'
import { type DayOfWeek } from './types'
import { getDays } from './utils'

interface Props {
  startOfWeek?: DayOfWeek
  current?: Dayjs
  selection?: 'date' | 'week'
  onClick?: (dayjs: Dayjs) => void
}

const DayCalendar = ({
  current = dayjs(),
  startOfWeek = 0,
  onClick,
}: Props) => {
  const days = useMemo(
    () => getDays({ current, startOfWeek }),
    [current, startOfWeek],
  )
  const daysOfWeek = rotate(DAYS_OF_WEEK, startOfWeek)
  return (
    <div className="relative overflow-clip">
      <div className="grid grid-cols-7">
        {daysOfWeek.map((day) => (
          <span className="aspect-square p-[6px]">{day}</span>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const sameMonth = day.isSame(current, 'month')
          if (!sameMonth) return <div />
          return (
            <button
              className="aspect-square p-[6px] hover:bg-primary hover:font-bold hover:text-white"
              onClick={() => onClick?.(day)}
            >
              {day.format('D')}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default DayCalendar
