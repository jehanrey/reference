import { useState } from 'react'

import Button from '../components/Button'
import Popover from '../components/Popover'
import Table, { TableColumns } from '../components/Table'
import useCheckbox from '../components/Table/hooks/useCheckbox'
import useSort from '../components/Table/hooks/useSort'

const d1 = [{ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 }]

const c1: TableColumns<(typeof d1)[number]> = [
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

const d2 = [
  { first: 'Jehan', last: 'Reyes' },
  { first: 'Marian', last: 'Alvarez' },
  { first: 'Shaina', last: 'Loria' },
]

const Palette = () => {
  return (
    <div className="flex h-[20px] gap-[2.5px]">
      <div className="bg-something-50 aspect-square h-auto"></div>
      <div className="bg-something-100 aspect-square h-auto"></div>
      <div className="bg-something-200 aspect-square h-auto"></div>
      <div className="bg-something-300 aspect-square h-auto"></div>
      <div className="bg-something-400 aspect-square h-auto"></div>
      <div className="bg-something-500 aspect-square h-auto"></div>
      <div className="bg-something-600 aspect-square h-auto"></div>
      <div className="bg-something-700 aspect-square h-auto"></div>
      <div className="bg-something-800 aspect-square h-auto"></div>
      <div className="bg-something-900 aspect-square h-auto"></div>
      <div className="bg-something-950 aspect-square h-auto"></div>
    </div>
  )
}

const Test = () => {
  const [count, setCount] = useState<number>(0)

  const { sortedData, tableProps: sortTableProps } = useSort(d2)

  const { tableProps: checkboxTableProps } = useCheckbox(sortedData)

  return (
    <div>
      <div className="text-test">Hello from Test</div>
      <div>
        <h2>Palette</h2>
        <ul className="*:font-bold">
          <li className="text-something-50">50</li>
          <li className="text-something-100">100</li>
          <li className="text-something-200">200</li>
          <li className="text-something-300">300</li>
          <li className="text-something-400">400</li>
          <li className="text-something-500">500</li>
          <li className="text-something-600">600</li>
          <li className="text-something-700">700</li>
          <li className="text-something-800">800</li>
          <li className="text-something-900">900</li>
          <li className="text-something-950">950</li>
        </ul>
      </div>
      <Palette />
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
        <Table dataSource={d1} columns={c1} />
      </div>
      <div>
        <Popover
          trigger={({ open }) => (
            <button>I am {open ? 'open' : 'closed'}</button>
          )}
          content={({ setOpen }) => (
            <div>
              <h2>Hello from Popover Content</h2>
              <button onClick={() => setOpen(false)}>Close popover</button>
            </div>
          )}
        />
      </div>
    </div>
  )
}

export default Test
