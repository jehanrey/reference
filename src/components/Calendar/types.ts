import { NumRange } from '../../types/number'

import { VIEWS } from './constants'

export type View = (typeof VIEWS)[number]

export type DayOfWeek = NumRange<0, 6>
