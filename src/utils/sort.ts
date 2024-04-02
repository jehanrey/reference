import dayjs from 'dayjs'

import { Leaf } from '../types/object'

import { getLeafValue } from './object'

export const defaultSortFn =
  <T extends Record<string, unknown>>(sortColumn: Leaf<T>) =>
  (a: T, b: T, order: string | null | undefined) => {
    const aValue = getLeafValue(a, sortColumn)
    const bValue = getLeafValue(b, sortColumn)
    return (
      `${aValue ?? ''}`.localeCompare(`${bValue ?? ''}`, 'en', {
        numeric: true,
      }) * (order === 'desc' ? -1 : 1)
    )
  }

export const dateSortFn =
  <T extends Record<string, unknown>>(sortColumn: Leaf<T>) =>
  (a: T, b: T, order: string | null | undefined) => {
    const sortValue = (() => {
      const aValue = dayjs(
        getLeafValue(a, sortColumn) as Parameters<typeof dayjs>[0],
      )
      const bValue = dayjs(
        getLeafValue(b, sortColumn) as Parameters<typeof dayjs>[0],
      )
      return aValue.isBefore(bValue) ? -1 : 1
    })()
    return sortValue * (order === 'desc' ? -1 : 1)
  }
