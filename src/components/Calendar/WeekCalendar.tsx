import dayjs, { type Dayjs } from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { useMemo } from 'react'

import { rotate } from '../../utils/array'
import { parseClassNames } from '../../utils/parseClassNames'

import { DAYS_OF_WEEK } from './constants'
import { type DayOfWeek } from './types'
import { getDays } from './utils'

dayjs.extend(weekOfYear)

interface Props {
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
  const daysOfWeek = ['', ...rotate(DAYS_OF_WEEK, startOfWeek)]
  return (
    <div className="relative overflow-clip">
      <div className="grid grid-cols-8">
        {daysOfWeek.map((day) => (
          <span className="aspect-square p-[6px]">{day}</span>
        ))}
      </div>
      <div className="grid grid-cols-8">
        {days.map((day) => {
          const sameMonth = day.isSame(current, 'month')
          const today = day.isSame(current, 'date')
          const date = !sameMonth ? (
            <div />
          ) : (
            <button
              className={parseClassNames('aspect-square p-[6px]', [
                'font-bold text-primary',
                today,
              ])}
              onClick={() => onClick?.(day)}
            >
              {day.format('D')}
            </button>
          )
          if (day.get('day') === startOfWeek) {
            return (
              <>
                <div className="flex aspect-square items-center justify-center p-[6px]">{`W${day.week()}`}</div>
                {date}
              </>
            )
          }
          return date
        })}
      </div>
    </div>
  )
}

export default WeekCalendar
