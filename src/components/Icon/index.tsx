import { FC, HTMLAttributes, useEffect, useState } from 'react'

import { BaseAttributes } from '../../types/element'

import { svgStyles } from './styles'

type Props = BaseAttributes<'svg'> & {
  name: string
  size?: number | string
}

const Icon: FC<Props> = ({ name, size, style, ...svgProps }) => {
  const [LazyIcon, setLazyIcon] = useState<
    FC<HTMLAttributes<SVGSVGElement>> | undefined
  >(undefined)

  const [fetching, setFetching] = useState<boolean>(false)

  useEffect(() => {
    setFetching(true)
    import(`./assets/${name}.svg?react`)
      .then((m) => setLazyIcon(() => m.default))
      .catch((err) => console.error(err))
      .finally(() => setFetching(false))
  }, [name, setLazyIcon])

  if (fetching || !LazyIcon) {
    return <div style={{ minHeight: size, minWidth: size }} />
  }

  return <LazyIcon style={{ ...svgStyles(size), ...style }} {...svgProps} />
}

export default Icon
