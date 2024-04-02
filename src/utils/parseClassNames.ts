export type Value = string | undefined | null

export type Condition = boolean | null | undefined | (() => boolean)

export type ClassTuple = [Value, Condition]

export const parseClassNames = (...args: Array<Value | ClassTuple>) => {
  return args
    .map((a) => {
      if (Array.isArray(a)) {
        const [value, condition] = a
        return (typeof condition === 'function' ? condition() : condition)
          ? value
          : undefined
      }
      return a
    })
    .filter(Boolean)
    .join(' ')
}
