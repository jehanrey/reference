import dayjs, { type Dayjs } from 'dayjs'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useMemo, useState } from 'react'

import { rotate } from '../../utils/array'
import { parseClassNames } from '../../utils/parseClassNames'

import { DAYS_OF_WEEK } from './constants'
import type { Date, DateRange, DayOfWeek } from './types'
import { getDays, variants } from './utils'

export interface Props {
  startOfWeek?: DayOfWeek
  current?: Dayjs
  selection?: 'date' | 'week'
  onClick?: (dayjs: Dayjs) => void
  validRange?: DateRange
  range?: DateRange
  hoveredDay?: Date
  onHover?: (day: Date) => void
  activeField?: 'start' | 'end'
  direction?: number
}

const DayCalendar = ({
  current = dayjs(),
  startOfWeek = 0,
  onClick,
  validRange = [dayjs().subtract(1, 'month'), dayjs()], // remove this later
  range,
  hoveredDay: controlledHover,
  onHover: setControlledHover,
  activeField,
  direction = 0,
}: Props) => {
  const [uncontrolledHover, setUncontrolledHover] = useState<Dayjs | null>()

  const hoveredDay = controlledHover ?? uncontrolledHover

  const setHoveredDay = useCallback(
    (x: Dayjs | null) => {
      setControlledHover?.(x)
      setUncontrolledHover(x)
    },
    [setControlledHover],
  )

  const days = useMemo(
    () => getDays({ current, startOfWeek }),
    [current, startOfWeek],
  )

  const daysOfWeek = rotate(DAYS_OF_WEEK, startOfWeek)
  return (
    <div className="relative overflow-clip">
      <div className="grid grid-cols-7">
        {daysOfWeek.map((day) => (
          <span key={day} className="aspect-square p-[6px]">
            {day}
          </span>
        ))}
      </div>
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.div
          key={current.toString()}
          className="grid grid-cols-7 gap-y-1 *:aspect-square *:p-[6px]"
          variants={variants}
          initial="enter"
          animate="middle"
          exit="exit"
          custom={direction}
        >
          {days.map((day) => {
            const key = day.toString()
            const sameMonth = day.isSame(current, 'month')
            if (!sameMonth) return <div key={key} />

            const isValid =
              validRange === undefined ||
              (!day.isBefore(validRange[0], 'day') &&
                !day.isAfter(validRange[1], 'day'))

            if (!isValid) {
              return (
                <button key={key} className="text-gray-300" disabled>
                  {day.format('D')}
                </button>
              )
            }

            const isEnd =
              day.isSame(range?.at(0) ?? null, 'day') ||
              day.isSame(range?.at(1) ?? null, 'day')
            const isBetweenEnds =
              day.isAfter(range?.at(0) ?? null, 'day') &&
              day.isBefore(range?.at(1) ?? null, 'day')
            const isExtendHint =
              activeField !== undefined &&
              (activeField === 'start'
                ? day.isAfter(hoveredDay ?? null, 'day') &&
                  day.isBefore(range?.at(0) ?? null, 'day')
                : day.isAfter(range?.at(1) ?? null, 'day') &&
                  day.isBefore(hoveredDay ?? null, 'day'))

            return (
              <button
                key={key}
                className={parseClassNames(
                  'border-y-2 transition-colors hover:rounded-lg',
                  ['border-white', (!isEnd && !isExtendHint) || isBetweenEnds],
                  ['hover:border-white hover:bg-gray-200', !isEnd],
                  [
                    'text-primary-text hover:border-primary-hover rounded-lg border-primary border-opacity-100 bg-primary hover:bg-primary-light',
                    isEnd,
                  ],
                  ['bg-primary-light', isBetweenEnds],
                  [
                    'border-dashed border-gray-300 border-opacity-100',
                    isExtendHint,
                  ],
                )}
                onClick={() => onClick?.(day)}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                tabIndex={-1}
              >
                {day.format('D')}
              </button>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default DayCalendar
