export const rotate = <T>(arr: Array<T>, by: number) => {
  const newArr = [...arr]
  newArr.unshift(...newArr.splice(by))
  return newArr
}
