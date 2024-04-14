import dayjs, { type Dayjs } from 'dayjs'
import { useMemo } from 'react'

import { parseClassNames } from '../../utils/parseClassNames'

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
        const thisYear = year.isSame(current, 'year')
        return (
          <button
            className={parseClassNames('aspect-[3/2] p-[16px]', [
              'font-bold text-primary',
              thisYear,
            ])}
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
