import { forwardRef } from 'react'

import { BaseAttributes } from '../../types/element'
import { ClassTuple, parseClassNames } from '../../utils/parseClassNames'

type Props = BaseAttributes<'button'> & {
  loading?: boolean
  primary?: boolean
  variant?: 'block' | 'outline' | 'text'
  px?: string | number
  py?: string | number
}

// TODO: Revisit once color palette using oklch has been finalized
const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    className,
    disabled,
    loading,
    style,
    primary,
    variant = 'block',
    px = 8,
    py = 4,
    children,
    ...rest
  },
  ref,
) {
  const computedClassNames = ((): Array<ClassTuple> => {
    // if (disabled) {
    //   return [
    //     ['border-button-disabled bg-button-disabled', variant === 'block'],
    //     ['border-button-disabled bg-transparent', variant === 'outline'],
    //     ['border-transparent bg-transparent', variant === 'text'],
    //   ]
    // }
    // if (loading) {
    //   return [
    //     [
    //       'border-button-loadingBase bg-button-loadingBase text-button-loadingBaseText',
    //       !primary && variant === 'block',
    //     ],
    //     [
    //       'border-button-loadingPrimary bg-button-loadingPrimary text-button-primaryText',
    //       primary && variant === 'block',
    //     ],
    //     [
    //       'border-button-loadingBase bg-transparent text-button-loadingBaseText',
    //       !primary && variant === 'outline',
    //     ],
    //     [
    //       'border-button-loadingPrimary bg-transparent text-button-loadingPrimary',
    //       primary && variant === 'outline',
    //     ],
    //     [
    //       'border-transparent bg-transparent text-button-loadingBaseText',
    //       variant === 'text',
    //     ],
    //   ]
    // }
    return [
      [
        'border-button-base bg-button-base text-button-baseText hover:border-button-baseHover hover:bg-button-baseHover',
        !primary && variant === 'block',
      ],
      [
        'border-primary bg-primary text-button-primaryText hover:border-primary-light hover:bg-primary-light',
        primary && variant === 'block',
      ],
      [
        'border-button-base bg-transparent hover:border-button-baseHover hover:text-button-primary',
        !primary && variant === 'outline',
      ],
      [
        'border-button-primary bg-transparent text-button-primary hover:border-button-primaryHover hover:text-button-primaryHover',
        primary && variant === 'outline',
      ],
      [
        'border-transparent bg-transparent hover:text-button-primary',
        !primary && variant === 'text',
      ],
      [
        'border-transparent bg-transparent text-button-primary hover:text-button-primaryHover',
        primary && variant === 'text',
      ],
    ]
  })()
  return (
    <button
      ref={ref}
      className={parseClassNames(
        'common-button relative box-border rounded border border-solid font-normal',
        ['text-button-disabledText cursor-not-allowed', disabled],
        ...computedClassNames,
        className,
      )}
      style={{
        paddingLeft: px,
        paddingRight: px,
        paddingTop: py,
        paddingBottom: py,
        ...style,
      }}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
})

export default Button
