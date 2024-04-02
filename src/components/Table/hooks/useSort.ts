import { useMemo, useState } from 'react'

import { TableColumn, TableRow } from '..'
import { Leaf } from '../../../types/object'
import { defaultSortFn } from '../../../utils/sort'

type SortOrder = string | null | undefined

export type SorterFn<T> = (a: T, b: T, order: string) => number

export type SorterState = Array<string>

interface SortColumn<T> {
  key: string | Leaf<T>
  sorterFn?: SorterFn<T>
  sorterState?: SorterState
}

export interface TableSortProps<T> {
  sortKey?: Leaf<T>
  sortOrder?: SortOrder
  onSort?: (column: SortColumn<T>) => void
}

const extractDefaults = <T extends TableRow>(
  column?: TableColumn<T> | SortColumn<T>,
): SortColumn<T> | undefined => {
  if (!column) return undefined
  const { key, sorterFn, sorterState } = column
  return {
    key,
    sorterFn,
    sorterState,
  }
}

interface InitialState<T extends TableRow> {
  sortColumn: SortColumn<T> | TableColumn<T>
  sortOrder: SortOrder
}

const useSort = <T extends TableRow>(
  data: Array<T>,
  initialState: Partial<InitialState<T>> | undefined = {},
): { sortedData: Array<T>; tableProps: TableSortProps<T> } => {
  const [sortColumn, setSortColumn] = useState<SortColumn<T> | undefined>(
    extractDefaults(initialState.sortColumn),
  )
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialState.sortOrder)

  const onSort = ({
    key,
    sorterFn,
    sorterState = ['asc', 'desc'],
  }: SortColumn<T>) => {
    if (sortColumn?.key === key) {
      const nextIndex = sorterState.indexOf(sortOrder || '') + 1
      setSortOrder(sorterState.at(nextIndex))
      return
    }
    setSortColumn({ key, sorterFn, sorterState })
    setSortOrder(sorterState.at(0))
  }

  const sortedData = useMemo(() => {
    if (sortOrder && sortColumn) {
      const sorted = data.toSorted((a, b) =>
        (sortColumn.sorterFn || defaultSortFn(sortColumn.key as Leaf<T>))(
          a,
          b,
          sortOrder,
        ),
      )
      return sorted
    }
    return data
  }, [data, sortColumn, sortOrder])

  return {
    sortedData,
    tableProps: {
      sortKey: sortColumn?.key as Leaf<T>,
      sortOrder,
      onSort,
    },
  }
}

export default useSort
