import dayjs, { Dayjs } from 'dayjs'

import { roundToClosest } from '../../utils/number'

import { DayOfWeek } from './types'

export function getStartOfWeek(date: Dayjs, firstDayOfWeek: DayOfWeek = 1) {
  let value = dayjs(date)
  while (value.get('day') !== firstDayOfWeek) {
    value = value.subtract(1, 'day')
  }
  return value
}

export function getEndOfWeek(date: Dayjs, startOfWeek: DayOfWeek = 1) {
  let value = dayjs(date)
  const lastDayOfWeek = 6 - startOfWeek
  while (value.get('day') !== lastDayOfWeek) {
    value = value.add(1, 'day')
  }
  return value
}

export const getDays = ({
  current,
  startOfWeek,
}: {
  current: Dayjs
  startOfWeek?: DayOfWeek
}): Array<Dayjs> => {
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
