import dayjs, { Dayjs } from 'dayjs'
import { Transition, Variants } from 'framer-motion'

import { roundToClosest } from '../../utils/number'

import { DayOfWeek } from './types'

export function getStartOfWeek(date: Dayjs, firstDayOfWeek: DayOfWeek) {
  let value = dayjs(date)
  while (value.get('day') !== firstDayOfWeek) {
    value = value.subtract(1, 'day')
  }
  return value
}

export function getEndOfWeek(date: Dayjs, startOfWeek: DayOfWeek) {
  let value = dayjs(date)
  const lastDayOfWeek = 6 - startOfWeek
  while (value.get('day') !== lastDayOfWeek) {
    value = value.add(1, 'day')
  }
  return value
}

export const getDays = ({
  current,
  startOfWeek = 0,
}: {
  current: Dayjs
  startOfWeek?: DayOfWeek
}) => {
  const startDay = getStartOfWeek(current.startOf('month'), startOfWeek)
  const endDay = getEndOfWeek(current.endOf('month'), startOfWeek)
  let currDay = startDay
  const days = []
  while (!currDay.isAfter(endDay, 'day')) {
    days.push(currDay)
    currDay = currDay.add(1, 'day')
  }
  return days
}

export const getWeeks = ({
  current,
  startOfWeek = 0,
}: {
  current: Dayjs
  startOfWeek?: DayOfWeek
}) => {
  const startDay = getStartOfWeek(current.startOf('month'), startOfWeek)
  const endDay = getEndOfWeek(current.endOf('month'), startOfWeek)
  let currDay = startDay
  const days = []
  while (!currDay.isAfter(endDay, 'day')) {
    days.push(currDay)
    currDay = currDay.add(1, 'day')
  }
  const weeks = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }
  return weeks
}

export const getMonths = (current: Dayjs) => {
  const startMonth = current.startOf('year')
  const endMonth = startMonth.add(11, 'months')
  const months = []
  let currMonth = startMonth
  while (!currMonth.isAfter(endMonth)) {
    months.push(currMonth)
    currMonth = currMonth.add(1, 'month')
  }
  return months
}

export const getYears = (current: Dayjs) => {
  const startYear = dayjs().set('year', roundToClosest(current.get('year'), 10))
  const endYear = startYear.add(9, 'year')
  const years = []
  let currYear = startYear
  while (!currYear.isAfter(endYear)) {
    years.push(currYear)
    currYear = currYear.add(1, 'year')
  }
  return years
}

export const transition: Transition = {
  type: 'spring',
  bounce: 0.15,
  duration: 0.25,
}

export const variants: Variants = {
  enter: (direction: number) => ({
    x: `${100 * direction}%`,
    opacity: direction == 0 ? 0 : 1,
  }),
  middle: { x: '0%', opacity: 1 },
  exit: (direction: number) => ({
    x: `${-100 * direction}%`,
    opacity: direction == 0 ? 0 : 1,
  }),
}
