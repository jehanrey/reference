import dayjs, { Dayjs } from 'dayjs'
import { type FC, useEffect, useState } from 'react'

import Calendar from '../Calendar'
import { View } from '../Calendar/types'
import { Popover, PopoverContent, PopoverTrigger } from '../Popover'

type Target = 'date' | 'week' | 'month'

type Date = Dayjs | null

type Single = {
  multi?: never
  value?: Date
  onChange?: (date: Date) => void
}

type Multi = {
  multi: true
  value?: [Date, Date]
  onChange?: (range: [Date, Date]) => void
}

type Value = Single | Multi

type Props = {
  view?: View
  target?: Target
} & Value

const DatePicker: FC<Props> = ({
  multi = false,
  value,
  view: initialView = 'day',
  target = 'date',
}) => {
  const init = multi ? [dayjs(), dayjs()] : dayjs()

  const startDate = Array.isArray(init) ? init.at(0) : init

  const [currentView, setCurrentView] = useState<View>(initialView)

  const onClick = (dayjs: Dayjs) => {
    if (currentView === 'year') {
      setCurrentView('month')
      return
    }
    if (currentView === 'month') {
      setCurrentView('day')
      return
    }
    console.log(dayjs.format('DD/MM/YYYY'))
  }

  useEffect(() => {
    setCurrentView(initialView)
  }, [initialView])

  return (
    <Popover>
      <PopoverTrigger>
        <div>Pretend I'm a input element</div>
      </PopoverTrigger>
      <PopoverContent className="isolate rounded bg-white text-sm shadow-lg">
        <div className="grid auto-cols-max auto-rows-max px-[20px] py-[10px] font-medium">
          <div className="flex justify-center gap-[10px]">
            <button onClick={() => setCurrentView('month')}>
              {startDate?.format('MMM')}
            </button>
            <button onClick={() => setCurrentView('year')}>
              {startDate?.format('YYYY')}
            </button>
          </div>
          <Calendar view={currentView} onClick={onClick} />
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker
