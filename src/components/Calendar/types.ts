import { Dayjs } from 'dayjs'

import { NumRange } from '../../types/number'

export type Picker = 'day' | 'week' | 'month' | 'year'

export type DayOfWeek = NumRange<0, 6>

export type Date = Dayjs | null

export type DateRange = [Date, Date]
