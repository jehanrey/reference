import dayjs, { type Dayjs } from 'dayjs'
import { useMemo } from 'react'

import { parseClassNames } from '../../utils/parseClassNames'

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
        const thisMonth = month.isSame(current, 'month')
        return (
          <button
            className={parseClassNames('aspect-[3/2] p-[20px]', [
              'font-bold text-primary',
              thisMonth,
            ])}
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
