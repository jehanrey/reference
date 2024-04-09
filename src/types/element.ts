export type BaseAttributes<
  T extends keyof JSX.IntrinsicElements,
  O extends keyof JSX.IntrinsicElements[T] | void = void,
> = O extends keyof JSX.IntrinsicElements[T]
  ? Omit<JSX.IntrinsicElements[T], O>
  : JSX.IntrinsicElements[T]
