import { useState } from 'react'

import Button from '../components/Button'
import Table from '../components/Table'
import useCheckbox from '../components/Table/hooks/useCheckbox'
import useSort from '../components/Table/hooks/useSort'

const c1 = [
  { key: 'a', header: 'a' },
  {
    key: 'b',
    header: 'b',
    children: [
      { key: 'c', header: 'c' },
      { key: 'd', header: 'd' },
    ],
  },
  {
    key: 'e',
    header: 'e',
    children: [
      { key: 'f', header: 'f' },
      { key: 'g', header: 'g' },
    ],
  },
  {
    key: 'h',
    header: 'h',
  },
]

const d1 = [{ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 }]

const d2 = [
  { first: 'Jehan', last: 'Reyes' },
  { first: 'Marian', last: 'Alvarez' },
  { first: 'Shaina', last: 'Loria' },
]

const Test = () => {
  const [count, setCount] = useState<number>(0)

  const { sortedData, tableProps: sortTableProps } = useSort(d2)

  const { tableProps: checkboxTableProps } = useCheckbox(sortedData)

  return (
    <div>
      <div>Hello from Test</div>
      <div className="flex gap-[15px]">
        <Button primary onClick={() => setCount((x) => ++x)}>
          Click Me Daddy
        </Button>
        <div>Count: {count}</div>
      </div>
      <div className="w-1/2">
        <Table
          dataSource={sortedData}
          columns={[
            {
              key: 'first',
              header: 'First Name',
              render: ({ first, last }) => (last === 'Loria' ? 'Shai' : first),
              sort: true,
            },
            {
              key: 'last',
              header: 'Last Name',
            },
          ]}
          {...sortTableProps}
          {...checkboxTableProps}
        />
      </div>
      <div className="w-1/3">
        <Table
          dataSource={d1}
          columns={[
            { key: 'a', header: 'a' },
            {
              key: 'b',
              header: 'b',
              children: [
                { key: 'c', header: 'c' },
                { key: 'd', header: 'd' },
              ],
            },
            {
              key: 'e',
              header: 'e',
              children: [
                { key: 'f', header: 'f' },
                { key: 'g', header: 'g' },
              ],
            },
            {
              key: 'h',
              header: 'h',
            },
          ]}
        />
      </div>
    </div>
  )
}

export default Test
