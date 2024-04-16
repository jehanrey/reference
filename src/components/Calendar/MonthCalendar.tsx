import dayjs, { type Dayjs } from 'dayjs'
import { useMemo } from 'react'

import { getMonths } from './utils'

interface Props {
  current?: Dayjs
  onClick?: (dayjs: Dayjs) => void
}

const MonthCalendar = ({ current = dayjs(), onClick }: Props) => {
  const months = useMemo(() => getMonths(current), [current])
  return (
    <div className="grid grid-cols-4">
      {months.map((month) => {
        return (
          <button
            className="aspect-[3/2] p-[20px] hover:bg-primary hover:text-white"
            onClick={() => onClick?.(month)}
          >
            {month.format('MMM')}
          </button>
        )
      })}
    </div>
  )
}

export default MonthCalendar
