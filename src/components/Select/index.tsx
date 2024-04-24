'use client';
import {
  useState,
  ComponentProps,
  useCallback,
  forwardRef,
  ChangeEvent,
  useEffect,
} from 'react';
import cx from 'clsx';
import {
  useFloating,
  autoUpdate,
  useClick,
  useInteractions,
  useDismiss,
  offset,
  flip,
  shift,
  type Placement,
} from '@floating-ui/react';

export interface Option {
  label: string;
  value: string | number;
}

type SelectProps = OverWrite<
  ComponentProps<'select'>,
  {
    placeholder?: string;
    placement?: Placement;
    options: Option[];
    defaultValue?: Option;
  }
>;

//TODO: re-render issues
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      className,
      defaultValue,
      placeholder = 'Select',
      placement = 'top',
      onChange,
      name,
      value,
      ...props
    },
    ref,
  ) => {
    const [selectedOption, setSelectedOption] = useState<Option | undefined>(
      defaultValue,
    );
    const [isOpen, setIsOpen] = useState(false);
    const [isHover, setIsHover] = useState(false);

    const { refs, floatingStyles, context } = useFloating({
      middleware: [offset(4), flip(), shift()],
      placement: placement,
      whileElementsMounted: autoUpdate,
      open: isOpen,
      onOpenChange: setIsOpen,
    });

    const click = useClick(context, { event: 'mousedown' });
    const dismiss = useDismiss(context, { outsidePressEvent: 'mousedown' });

    const handleMouseEnter = useCallback(() => {
      setIsHover(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
      setIsHover(false);
    }, []);

    const { getReferenceProps, getFloatingProps } = useInteractions([
      click,
      dismiss,
    ]);

    const handleSelect = useCallback(
      (option: Option) => {
        setSelectedOption(option);
        setIsOpen(false);
        onChange?.({ target: { value: option.value, name } } as any);
      },
      [onChange],
    );

    //TODO:temporary solution, there must be a better flow
    useEffect(() => {
      if (!value) {
        setSelectedOption(defaultValue);
      }
    }, [value]);

    return (
      <div className="relative" suppressHydrationWarning>
        {/* <select
          className="hidden"
          ref={ref}
          name={name}
          onChange={handleControl}
        >
          {options.map((option) => (
            <option key={`${option.value}-native`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select> */}
        {/* Select */}
        <div
          ref={refs.setReference}
          {...getReferenceProps()}
          className={cx(
            'pl-[12px] pr-[4px] flex items-center justify-between w-[240px] h-[32px] text-[14px] leading-[22px] rounded-[8px] border-[#3B81F6] border-[1px] border-solid focus:border-[#3B81F6] hover:border-[#3B81F6] cursor-pointer',
            isOpen && 'border-[#3B81F6]',
            className,
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Selected or placeholder */}
          {selectedOption ? (
            <span className="text-[#FACC14]">{selectedOption.label}</span>
          ) : (
            <span className="text-[#9BA3AF]">{placeholder}</span>
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
                className={cx(
                  'pl-[12px] flex items-center w-full h-[32px] text-[14px] leading-[22px] text-[#323233] bg-[#FFFFFF] hover:bg-[#E6F4FF] cursor-pointer',
                  selectedOption?.value == option.value && 'bg-[#E6F4FF]',
                )}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);

export default Select;
