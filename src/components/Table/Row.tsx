import { ReactNode } from 'react'

import { Leaf } from '../../types/object'
import { getLeafValue } from '../../utils/object'
import { parseClassNames } from '../../utils/parseClassNames'

import { Props as TableProps, TableRow } from '.'

type ValueAndLoading<T> =
  | { loading: false; value: T }
  | { loading: true; value: undefined }

type Props<T extends TableRow> = ValueAndLoading<T> &
  Pick<
    TableProps<T>,
    'columns' | 'onRowClick' | 'highlightOnHover' | 'sortKey' | 'sortOrder'
  > & { index: number; checked?: boolean }

const Row = <T extends TableRow>({
  value,
  loading,
  columns,
  onRowClick,
  highlightOnHover,
  sortKey,
  sortOrder,
  checked,
  index,
}: Props<T>) => {
  return (
    <tr
      className={parseClassNames('group h-7', value?.className as string)}
      onClick={() => (loading ? undefined : onRowClick?.(value, index))}
    >
      {columns.map(
        ({
          header,
          key,
          render,
          alignData = 'center',
          background,
          forceBackground,
          className,
          minWidth,
        }) => (
          <td
            className={parseClassNames(
              'border border-neutral p-[16px] text-sm font-normal transition-all',
              ['group-hover:bg-[#fafafa]', highlightOnHover],
              className,
            )}
            key={`${header}-${key.toString()}`}
            style={{
              background: checked
                ? '#a29bfe30'
                : sortKey === key && sortOrder
                  ? '#fafafa'
                  : loading && !forceBackground
                    ? undefined
                    : typeof background === 'string'
                      ? background
                      : background?.(value),
              textAlign: alignData,
              minWidth,
            }}
          >
            {loading && key !== 'checkbox' ? (
              <div className="m-auto h-[1.25rem] w-4/5 animate-pulse rounded bg-slate-200" />
            ) : (
              ((render?.(value || ({} as T), index) ||
                getLeafValue(value, key as Leaf<T>)) as ReactNode) ?? '-'
            )}
          </td>
        ),
      )}
    </tr>
  )
}

export default Row
