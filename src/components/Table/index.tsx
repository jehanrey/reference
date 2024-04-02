import {
  CSSProperties,
  HTMLProps,
  ReactNode,
  useCallback,
  useMemo,
} from 'react'

import { Leaf } from '../../types/object'
import { parseClassNames } from '../../utils/parseClassNames'
import { randomInt } from '../../utils/randomInt'
import Checkbox from '../Checkbox'
import Icon from '../Icon'
import { TablePaginationProps } from '../Pagination'

import Row from './Row'
import { TableCheckboxProps } from './hooks/useCheckbox'
import { SorterFn, SorterState, TableSortProps } from './hooks/useSort'

export type TableRow = Record<string, unknown>

type RenderOrChildren<T extends TableRow> =
  | {
      render: (row: T, index: number) => ReactNode
      children?: never
    }
  | {
      render?: never
      children: TableColumns<T>
    }

type KeyAndRender<T extends TableRow> =
  | ({ key: Leaf<T> } & Partial<RenderOrChildren<T>>)
  | ({ key: string } & RenderOrChildren<T>)

export type TableColumn<T extends TableRow> = KeyAndRender<T> & {
  header?: ReactNode
  className?: HTMLProps<HTMLElement>['className']
  alignHeader?: CSSProperties['textAlign']
  alignData?: CSSProperties['textAlign']
  background?: string | ((row?: T) => string | undefined)
  forceBackground?: boolean
  width?: CSSProperties['width']
  minWidth?: CSSProperties['minWidth']
  sort?: boolean
  sorterFn?: SorterFn<T>
  sorterState?: SorterState
  sorterIcon?: ReactNode
}

export type TableColumns<T extends TableRow> = Array<TableColumn<T>>

export type Props<T extends TableRow> = {
  dataSource: Array<T>
  columns: TableColumns<T>
  withHeader?: boolean
  stickyHeader?: boolean
  loading?: boolean
  loadingRows?: number
  fixed?: boolean
  renderEmpty?: ReactNode
  onRowClick?: (record: T, index: number) => void
  highlightOnHover?: boolean
} & TableSortProps<T> &
  TableCheckboxProps<T> &
  TablePaginationProps

const Table = <T extends TableRow>({
  dataSource,
  columns,
  withHeader = true,
  stickyHeader,
  loading = false,
  loadingRows,
  fixed,
  renderEmpty,
  sortKey,
  sortOrder,
  onSort,
  withCheckbox,
  withCheckAll,
  disableCheckbox,
  onCheckItem,
  checkedAll,
  onCheckAll,
  isChecked,
  ...rowProps
}: Props<T>) => {
  const loadingDataSource = Array.from(Array(loadingRows ?? randomInt(1, 10)))

  const checkboxColumn: TableColumn<T> = useMemo(() => {
    return {
      key: 'checkbox',
      width: 25,
      header: withCheckAll ? (
        <div className="flex justify-center">
          <Checkbox
            checked={checkedAll}
            onChange={({ target: { checked } }) => onCheckAll?.(checked)}
            disabled={loading}
          />
        </div>
      ) : null,
      render: (row) => (
        <div className="flex justify-center">
          <Checkbox
            checked={isChecked?.(row)}
            onChange={() => onCheckItem?.(row)}
            onClick={(event) => event.stopPropagation()}
            disabled={loading || disableCheckbox?.(row)}
          />
        </div>
      ),
    }
  }, [
    checkedAll,
    disableCheckbox,
    isChecked,
    loading,
    onCheckAll,
    onCheckItem,
    withCheckAll,
  ])

  const headerLayers = useMemo(() => {
    const getLayers = (
      layers: Array<TableColumns<T>>,
    ): Array<TableColumns<T>> => {
      const currDeepestLayer = layers[layers.length - 1]
      const hasDeeperLayer = currDeepestLayer.some(
        ({ children }) => children !== undefined,
      )
      if (!hasDeeperLayer) return layers
      const nextLayer = currDeepestLayer.reduce((acc, curr) => {
        if (curr.children === undefined) return acc
        return [...acc, ...curr.children]
      }, [] as TableColumns<T>)
      return getLayers([...layers, nextLayer])
    }
    return getLayers([withCheckbox ? [checkboxColumn, ...columns] : columns])
  }, [checkboxColumn, columns, withCheckbox])

  const columnLeaves = useMemo(() => {
    const getLeaf = (column: TableColumn<T>): Array<TableColumn<T>> => {
      if (column.children === undefined) return [column]
      return column.children.map(getLeaf).flat()
    }
    const leaves = columns.map(getLeaf).flat()
    return withCheckbox ? [checkboxColumn, ...leaves] : leaves
  }, [checkboxColumn, columns, withCheckbox])

  const countDescendantLeaves = (column: TableColumn<T>): number => {
    if (column.children === undefined) return 1
    return column.children
      .map(countDescendantLeaves)
      .reduce((acc, curr) => acc + curr, 0)
  }

  const renderNoData = useCallback(() => {
    if (loading || dataSource.length !== 0) return false
    return (
      <tr>
        <td
          className="border border-neutral p-[16px] text-center text-sm font-normal"
          colSpan={columnLeaves.length}
        >
          {renderEmpty ?? 'No Data.'}
        </td>
      </tr>
    )
  }, [columnLeaves.length, dataSource.length, loading, renderEmpty])

  const dataSourceToRender = loading ? loadingDataSource : dataSource

  return (
    <table
      className={parseClassNames('isolate w-full border border-neutral', [
        'table-fixed',
        fixed,
      ])}
    >
      {withHeader && (
        <thead
          className={parseClassNames([
            'outline-[#f0f0f0 sticky top-0 z-10 shadow-md outline outline-2 -outline-offset-1',
            stickyHeader,
          ])}
        >
          {headerLayers.map((layer, index) => (
            <tr key={`h-layer-${index}`}>
              {layer.map((column) => {
                const {
                  key,
                  header,
                  children,
                  alignHeader = 'center',
                  className,
                  sort,
                  sorterFn,
                  sorterState,
                  sorterIcon,
                  width,
                  minWidth,
                } = column
                return (
                  <th
                    key={key.toString()}
                    className={parseClassNames(
                      'border border-neutral bg-[#fafafa] p-[16px] text-sm font-medium transition-all',
                      ['cursor-pointer', sort],
                      [
                        'bg-[#f5f5f5]',
                        sortKey === key && sorterState !== undefined,
                      ],
                      className,
                    )}
                    colSpan={countDescendantLeaves(column)}
                    rowSpan={children === undefined ? layer.length - index : 1}
                    style={{
                      textAlign: alignHeader,
                      width,
                      minWidth,
                    }}
                    role={sort ? 'button' : undefined}
                    onClick={() =>
                      sort
                        ? onSort?.({ key, sorterFn, sorterState })
                        : undefined
                    }
                  >
                    {sort ? (
                      <div className="relative flex items-center justify-center">
                        <div>{header}</div>
                        <div className="absolute right-0">
                          {sorterState ? (
                            sorterIcon ?? (
                              <Icon
                                name="outlined-sync"
                                className="fill-[##bfbfbf]"
                              />
                            )
                          ) : (
                            <div className="relative">
                              {[
                                { icon: 'filled-caret-up', order: 'asc' },
                                { icon: 'filled-caret-down', order: 'desc' },
                              ].map(({ icon, order }) => (
                                <Icon
                                  key={order}
                                  name={icon}
                                  className={parseClassNames(
                                    'absolute',
                                    [
                                      'fill-[#bfbfbf]',
                                      !(sortKey === key && sortOrder === order),
                                    ],
                                    [
                                      'fill-primary',
                                      sortKey === key && sortOrder === order,
                                    ],
                                  )}
                                  style={{
                                    [order === 'asc' ? 'top' : 'bottom']:
                                      'calc(50% - calc(11px * 0.8))',
                                  }}
                                  size={11}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      header ?? key
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
      )}
      <tbody className="relative">
        {renderNoData() ||
          dataSourceToRender.map((value, index) => (
            <Row
              key={`row-${JSON.stringify(value)}-${index}`}
              value={value}
              loading={loading}
              index={index}
              columns={columnLeaves}
              sortKey={sortKey}
              sortOrder={sortOrder}
              checked={isChecked?.(value)}
              {...rowProps}
            />
          ))}
      </tbody>
    </table>
  )
}

export default Table
