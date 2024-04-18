import { NumRange } from '../../types/number'

export type Picker = 'day' | 'week' | 'month' | 'year'

export type DayOfWeek = NumRange<0, 6>
