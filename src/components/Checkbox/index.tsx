import { ChangeEvent, FC, ReactNode, useState } from 'react'

import { BaseAttributes } from '../../types/element'
import { parseClassNames } from '../../utils/parseClassNames'

type Props = BaseAttributes<'input', 'type'> & {
  label?: ReactNode
  checked?: boolean
  gap?: string | number
}

const Checkbox: FC<Props> = ({
  label,
  checked: checkedOverride,
  gap,
  onChange,
  disabled,
  ...props
}) => {
  const [localChecked, setLocalChecked] = useState<boolean>(
    checkedOverride ?? false,
  )

  const checked = checkedOverride === undefined ? localChecked : checkedOverride

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (checkedOverride === undefined) {
      setLocalChecked((state) => !state)
    }
    onChange?.(event)
  }

  return (
    <label
      className={parseClassNames(
        'flex items-center',
        ['text-neutral-light', disabled],
        ['text-primary', checked],
      )}
      style={{ gap }}
    >
      <input
        type="checkbox"
        className={
          disabled
            ? 'cursor-not-allowed accent-neutral-light'
            : 'cursor-pointer accent-primary'
        }
        checked={checked}
        disabled={disabled}
        onChange={disabled ? undefined : handleChange}
        {...props}
      />
      {label}
    </label>
  )
}

export default Checkbox
