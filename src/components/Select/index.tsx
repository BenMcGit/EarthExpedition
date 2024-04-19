'use client'
import { useState, ComponentProps, useCallback, forwardRef } from 'react'
import cx from 'clsx'
import {
  useFloating,
  autoUpdate,
  useClick,
  useInteractions,
  useDismiss,
  offset,
  type Placement,
} from '@floating-ui/react'

interface Option {
  label: string
  value: string | number
}

type SelectProps = OverWrite<
  ComponentProps<'select'>,
  {
    placeholder?: string
    placement?: Placement
    options: Option[]
    defaultValue?: Option
  }
>

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      className,
      defaultValue,
      placeholder = 'Select',
      placement = 'bottom',
      onChange,
      name,
      ...props
    },
    ref,
  ) => {
    const [selectedOption, setSelectedOption] = useState<Option | undefined>(
      defaultValue,
    )
    const [isOpen, setIsOpen] = useState(false)
    const [isHover, setIsHover] = useState(false)

    const { refs, floatingStyles, context } = useFloating({
      middleware: [offset(4)],
      placement: placement,
      whileElementsMounted: autoUpdate,
      open: isOpen,
      onOpenChange: setIsOpen,
    })

    const click = useClick(context, { event: 'mousedown' })
    const dismiss = useDismiss(context, { outsidePressEvent: 'mousedown' })

    const handleMouseEnter = useCallback(() => {
      setIsHover(true)
    }, [])

    const handleMouseLeave = useCallback(() => {
      setIsHover(false)
    }, [])

    const { getReferenceProps, getFloatingProps } = useInteractions([
      click,
      dismiss,
    ])

    const handleSelect = useCallback(
      (option: Option) => {
        setSelectedOption(option)
        setIsOpen(false)
        onChange?.({ target: { value: option.value, name } } as any)
      },
      [onChange],
    )

    return (
      <div className="relative" suppressHydrationWarning>
        {/* Select */}
        <div
          ref={refs.setReference}
          {...getReferenceProps()}
          className={cx(
            'pl-[12px] pr-[7px] flex items-center justify-between w-[240px] h-[32px] text-[14px] leading-[22px] rounded-[8px] border-[#DCDEE0] border-[1px] border-solid focus:border-[#FFA14A] hover:border-[#FFA14A] cursor-pointer',
            isOpen && 'border-[#FFA14A]',
            className,
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Selected or placeholder */}
          {selectedOption ? (
            <span className="text-[#323233]">{selectedOption.label}</span>
          ) : (
            <span className="text-[#C1C2C5]">{placeholder}</span>
          )}
        </div>
        {isOpen && (
          //Dropdown
          <div
            className="w-[240px] rounded-[2px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.12)] z-100"
            ref={refs.setFloating}
            style={{ ...floatingStyles }}
            {...getFloatingProps()}
          >
            {/* Options */}
            {options.map((option) => (
              <div
                key={option.value}
                className="pl-[12px] flex items-center w-full h-[32px] text-[14px] leading-[22px] text-[#323233] bg-[#FFFFFF] hover:bg-[#FFF6ED] cursor-pointer"
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  },
)

export default Select
