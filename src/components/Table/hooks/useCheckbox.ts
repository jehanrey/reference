import { useCallback, useEffect, useMemo, useState } from 'react'

import { TableRow } from '..'

export interface TableCheckboxProps<T> {
  withCheckbox?: boolean
  withCheckAll?: boolean
  disableCheckbox?: (row: T) => boolean
  onCheckItem?: (row: T) => void
  checkedAll?: boolean
  onCheckAll?: (state: boolean) => void
  isChecked?: (row: T) => boolean
}

interface Config<T> {
  withCheckAll?: boolean
  disabledCheckbox?: (row: T) => boolean
  checkedItems?: Array<T>
}

const dataToMap = <T extends TableRow>(arr?: Array<T>) => {
  return new Map(arr?.map((r) => [JSON.stringify(r), r]))
}

const useCheckbox = <T extends TableRow>(
  dataSource: Array<T>,
  config?: Config<T>,
): {
  checkedItems: Array<T>
  checkedAll: boolean
  onCheckAll: (v: boolean) => void
  tableProps: TableCheckboxProps<T>
} => {
  const [checkedItems, setCheckedItems] = useState<Map<string, T>>(
    dataToMap(config?.checkedItems),
  )

  const checkedAll = useMemo(() => {
    return dataSource.every((r) => checkedItems.has(JSON.stringify(r)))
  }, [dataSource, checkedItems])

  const onCheckAll = useCallback(
    (nextState: boolean) => {
      setCheckedItems(new Map(nextState ? dataToMap(dataSource) : undefined))
    },
    [dataSource],
  )

  const onCheckItem = useCallback(
    (r: T) => {
      const recordString = JSON.stringify(r)
      const newCheckedItems = new Map(checkedItems)
      newCheckedItems.has(recordString)
        ? newCheckedItems.delete(recordString)
        : newCheckedItems.set(recordString, r)
      setCheckedItems(newCheckedItems)
    },
    [checkedItems],
  )

  const isChecked = useCallback(
    (r: T) => checkedItems.has(JSON.stringify(r)),
    [checkedItems],
  )

  const tableProps = {
    withCheckbox: true,
    withCheckAll: config?.withCheckAll ?? true,
    disableCheckBox: config?.disabledCheckbox,
    onCheckItem,
    checkedAll,
    onCheckAll,
    isChecked,
  }

  useEffect(() => {
    setCheckedItems(dataToMap(config?.checkedItems))
  }, [config?.checkedItems])

  return {
    checkedItems: Array.from(checkedItems.values()),
    checkedAll,
    onCheckAll,
    tableProps,
  }
}

export default useCheckbox
