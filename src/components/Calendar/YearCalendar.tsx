import dayjs, { type Dayjs } from 'dayjs'
import { useMemo } from 'react'

import { getYears } from './utils'

interface Props {
  current?: Dayjs
  onClick?: (dayjs: Dayjs) => void
}

const YearCalendar = ({ current = dayjs(), onClick }: Props) => {
  const years = useMemo(() => getYears(current), [current])
  return (
    <div className="grid grid-cols-3">
      {years.map((year) => {
        return (
          <button
            className="aspect-[3/2] p-[16px] hover:bg-primary hover:text-white"
            onClick={() => onClick?.(year)}
          >
            {year.format('YYYY')}
          </button>
        )
      })}
    </div>
  )
}

export default YearCalendar
