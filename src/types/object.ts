export type Leaf<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${Leaf<T[K]> extends never ? '' : `.${Leaf<T[K]>}`}`
    }[keyof T]
  : never
