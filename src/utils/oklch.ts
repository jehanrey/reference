import { NumRange } from '../types/number'

const lightness = [
  97.78, 93.56, 88.11, 82.67, 74.22, 64.78, 57.33, 46.89, 39.44, 32, 23.78,
]

const chroma = [
  0.0108, 0.0321, 0.0609, 0.0908, 0.1398, 0.1472, 0.1299, 0.1067, 0.0898,
  0.0726, 0.054,
]

const weights = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

const reference = (() => {
  return Array.from(Array(11)).map((_, index) => ({
    weight: weights[index],
    lightness: lightness[index],
    chroma: chroma[index],
  }))
})()

const generatePalette = (hue: NumRange<0, 360>, name: string) => {
  const palette = reference.map(({ weight, lightness, chroma }) => [
    weight,
    `oklch(${lightness} ${chroma} ${hue})`,
  ])
  return {
    [name]: Object.fromEntries(palette),
  }
}

export { generatePalette }
