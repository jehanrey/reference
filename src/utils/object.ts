import { Leaf } from '../types/object'

export const getLeafValue = <T extends Record<string, unknown>>(
  record: T | undefined,
  leaf: Leaf<T>,
): unknown => {
  const path = leaf.split('.')
  if (path.length === 1) return record?.[path.at(0) as keyof T]
  const [current, ...next] = path
  return getLeafValue(
    record?.[current] as Record<string, unknown>,
    next.join('.'),
  )
}

export const isEmpty = (obj: Record<string | number | symbol, unknown>) => {
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false
    }
  }
  return true
}
