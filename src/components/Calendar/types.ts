import { NumRange } from '../../types/number'

import { LEVELS } from './constants'

export type Level = (typeof LEVELS)[number]

export type DayOfWeek = NumRange<0, 6>
