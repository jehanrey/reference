import dayjs, { Dayjs, ManipulateType } from 'dayjs'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import {
  type FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import Calendar from '../Calendar'
import { DateRange, Picker } from '../Calendar/types'
import { transition } from '../Calendar/utils'
import Icon from '../Icon'
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '../Popover'

type Props = {
  picker?: Picker
  value?: DateRange
  onChange?: (range: DateRange) => void
  panes?: 1 | 2
}

const DatePicker: FC<Props> = ({
  picker = 'day',
  value: controlledValue,
  onChange: setControlledValue,
  panes = 2,
}) => {
  const startValueRef = useRef<HTMLInputElement>(null)
  const endValueRef = useRef<HTMLInputElement>(null)

  const [uncontrolledValue, setUncontrolledValue] = useState<DateRange>(() => [
    dayjs(),
    dayjs(),
  ])

  const value = useMemo(
    () => controlledValue ?? uncontrolledValue,
    [controlledValue, uncontrolledValue],
  )

  const setValue = useCallback(
    (param: DateRange | ((param: DateRange) => DateRange)) => {
      setControlledValue?.(typeof param === 'function' ? param(value) : param)
      setUncontrolledValue(param)
    },
    [setControlledValue, value],
  )

  const [currentPicker, setCurrentPicker] = useState<Picker>(picker)

  const [currentView, setCurrentView] = useState(value[1] ?? dayjs())

  const [direction, setDirection] = useState<number>(0)

  const changeCurrentView = useCallback(
    (next: Dayjs | ((current: Dayjs) => Dayjs)) => {
      setDirection(
        currentView.isAfter(
          typeof next === 'function' ? next(currentView) : next,
        )
          ? -1
          : 1,
      )
      setCurrentView(next)
    },
    [currentView],
  )

  const next = useCallback(
    (unit: ManipulateType) => {
      changeCurrentView((x) => x.add(1, unit))
    },
    [changeCurrentView],
  )

  const prev = useCallback(
    (unit: ManipulateType) => {
      changeCurrentView((x) => x.subtract(1, unit))
    },
    [changeCurrentView],
  )

  const currentPanes = useMemo(() => {
    if (picker === currentPicker) return panes
    return 1
  }, [picker, currentPicker, panes])

  const formatValue = (value: Dayjs | null | undefined) => {
    if (!value) return ''
    if (currentPicker === 'week')
      return `${value.format('YYYY')}-W${value.week()}`
    const formatter: Record<Exclude<Picker, 'week'>, string> = {
      day: 'YYYY/MM/DD',
      month: 'YYYY/MM',
      year: 'YYYY',
    }
    return value.format(formatter[currentPicker])
  }

  const [open, setOpen] = useState<boolean>(false)
  const [activeField, setActiveField] = useState<'start' | 'end'>('start')
  const [startValue, setStartValue] = useState(value[0])
  const [endValue, setEndValue] = useState(value[1])

  const toggleActiveField = useCallback(() => {
    setActiveField((prev) => (prev === 'start' ? 'end' : 'start'))
  }, [])

  const handleCalendarClick = useCallback(
    (day: Dayjs) => {
      if (activeField === 'start') {
        setStartValue(day)
      } else {
        setEndValue(day)
      }
      toggleActiveField()
    },
    [activeField, setEndValue, setStartValue, toggleActiveField],
  )

  const apply = useCallback(() => {
    setValue([startValue, endValue])
  }, [endValue, setValue, startValue])

  const togglePopover = () => {
    setOpen((state) => !state)
  }

  useEffect(() => {
    if (!open) {
      setActiveField('start')
    }
  }, [open])

  useEffect(() => {
    setCurrentPicker(picker)
  }, [picker])

  return (
    <Popover open={open} onOpenChange={setOpen} click={false}>
      <PopoverTrigger onClick={togglePopover}>
        <div className="relative grid w-min grid-cols-[2fr_1fr_2fr] border focus-within:border-primary-light hover:border-primary-light">
          <AnimatePresence>
            <input
              key="start-date"
              className="cursor-pointer text-center focus:outline-none"
              readOnly
              value={formatValue(startValue)}
              ref={startValueRef}
              onClick={(event) => {
                event.stopPropagation()
                if (activeField === 'end') {
                  setActiveField('start')
                  if (open) return
                }
                togglePopover()
              }}
            />
            <span className="px-2">~</span>
            <input
              key="end-date"
              className="cursor-pointer text-center focus:outline-none"
              readOnly
              value={formatValue(endValue)}
              ref={endValueRef}
              onClick={(event) => {
                event.stopPropagation()
                if (activeField === 'start') {
                  setActiveField('end')
                  if (open) return
                }
                togglePopover()
              }}
            />
            {open && (
              <motion.div
                key="active-highlight"
                layoutId="active-highlight"
                className="absolute bottom-0 h-[2px] w-full bg-primary"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 1, scale: 0 }}
                style={{
                  width:
                    activeField === 'start'
                      ? startValueRef.current?.getBoundingClientRect().width
                      : endValueRef.current?.getBoundingClientRect().width,
                  ...(activeField === 'start' ? { left: 0 } : { right: 0 }),
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </PopoverTrigger>
      <PopoverContent className="isolate border-collapse rounded border-neutral bg-white text-sm shadow-lg">
        <div className="grid auto-cols-max auto-rows-max px-[20px] py-[10px] font-medium *:select-none">
          <MotionConfig transition={transition}>
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
                <button key="month" onClick={() => setCurrentPicker('month')}>
                  {currentView?.format('MMM')}
                </button>
                <button key="year" onClick={() => setCurrentPicker('year')}>
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
            <Calendar
              picker={currentPicker}
              current={currentView}
              onClick={handleCalendarClick}
              range={[startValue, endValue]}
              activeField={activeField}
              direction={direction}
            />
          </MotionConfig>
        </div>
        <div className="relative flex justify-end gap-[12px] bg-slate-300 px-[16px] py-[10px]">
          <PopoverClose>Cancel</PopoverClose>
          <PopoverClose onClick={apply}>Apply</PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker
