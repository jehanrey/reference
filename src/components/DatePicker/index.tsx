import dayjs, { Dayjs, ManipulateType } from 'dayjs'
import { type FC, useCallback, useEffect, useState } from 'react'

import Calendar from '../Calendar'
import { Level } from '../Calendar/types'
import Icon from '../Icon'
import { Popover, PopoverContent, PopoverTrigger } from '../Popover'

type DateRange = [Dayjs | null, Dayjs | null]

type Props = {
  level?: Level
  value?: DateRange
  onChange?: (range: DateRange) => void
}

const DatePicker: FC<Props> = ({
  value: controlledValue,
  onChange: setControlledValue,
  level = 'day',
}) => {
  const [uncontrolledValue, setUncontrolledValue] = useState<DateRange>([
    null,
    null,
  ])

  const value = controlledValue ?? uncontrolledValue

  const setValue = useCallback(
    (date: DateRange) => {
      setControlledValue?.(date)
      setUncontrolledValue(date)
    },
    [setControlledValue],
  )

  const [currentLevel, setCurrentLevel] = useState<Level>(level)

  const [newStartValue, setNewStartValue] = useState(value[0])

  const [newEndValue, setNewEndValue] = useState(value[1])

  const [currentView, setCurrentView] = useState(value[1] ?? dayjs())

  const next = useCallback((unit: ManipulateType) => {
    setCurrentView((x) => x.add(1, unit))
  }, [])

  const prev = useCallback((unit: ManipulateType) => {
    setCurrentView((x) => x.subtract(1, unit))
  }, [])

  useEffect(() => {
    setCurrentLevel(level)
  }, [level])

  return (
    <Popover>
      <PopoverTrigger>
        <div>Pretend I'm a input element</div>
      </PopoverTrigger>
      <PopoverContent className="isolate rounded bg-white text-sm shadow-lg">
        <div className="grid auto-cols-max auto-rows-max px-[20px] py-[10px] font-medium">
          <div className="flex items-center justify-between">
            <div className="flex gap-[10px]">
              <Icon
                name="outlined-double-left"
                className="cursor-pointer hover:fill-primary"
                onClick={() => prev('year')}
              />
              <Icon
                name="outlined-left"
                className="cursor-pointer hover:fill-primary"
                onClick={() => prev('month')}
              />
            </div>
            <div className="flex justify-center gap-[10px]">
              <button onClick={() => setCurrentLevel('month')}>
                {currentView?.format('MMM')}
              </button>
              <button onClick={() => setCurrentLevel('year')}>
                {currentView?.format('YYYY')}
              </button>
            </div>
            <div className="flex gap-[10px]">
              <Icon
                name="outlined-right"
                className="cursor-pointer hover:fill-primary"
                onClick={() => next('month')}
              />
              <Icon
                name="outlined-double-right"
                className="cursor-pointer hover:fill-primary"
                onClick={() => next('year')}
              />
            </div>
          </div>
          <Calendar level={currentLevel} current={currentView} />
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker
