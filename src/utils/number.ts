export const roundToClosest = (n: number, to: number) => n - (n % to)

export const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min
