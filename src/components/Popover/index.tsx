import {
  FloatingFocusManager,
  FloatingPortal,
  type Placement,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useMergeRefs,
  useRole,
} from '@floating-ui/react'
import {
  type ButtonHTMLAttributes,
  type FC,
  type HTMLProps,
  type ReactNode,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useMemo,
  useState,
} from 'react'

interface PopoverOptions {
  initialOpen?: boolean
  placement?: Placement
  modal?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  click?: boolean
}

const usePopover = ({
  initialOpen = false,
  placement = 'bottom',
  modal = false,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  click: enableClick = true,
}: PopoverOptions) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen)

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        crossAxis: placement.includes('-'),
        fallbackAxisSideDirection: 'end',
        padding: 5,
      }),
      shift({ padding: 5 }),
    ],
  })

  const context = data.context

  const click = useClick(context, { enabled: enableClick })
  const dismiss = useDismiss(context)
  const role = useRole(context)

  const interactions = useInteractions([click, dismiss, role])

  return useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      modal,
    }),
    [data, interactions, modal, open, setOpen],
  )
}

const PopoverContext = createContext<ReturnType<typeof usePopover> | null>(null)

const usePopoverContext = () => {
  const context = useContext(PopoverContext)

  if (context == null) {
    throw new Error('Popover components must be wrapped in <Popover />')
  }

  return context
}

type ReactNodeWithContext =
  | ReactNode
  | ((
      ctx: Pick<ReturnType<typeof usePopover>, 'open' | 'setOpen'>,
    ) => ReactNode)

const InjectContext = ({ children }: { children: ReactNodeWithContext }) => {
  const { open, setOpen } = usePopoverContext()
  return typeof children === 'function' ? children({ open, setOpen }) : children
}

export const Popover: FC<PopoverOptions & { children: ReactNode }> = ({
  children,
  ...options
}) => {
  const popover = usePopover(options)
  return (
    <PopoverContext.Provider value={popover}>
      {children}
    </PopoverContext.Provider>
  )
}

interface PopoverTriggerProps {
  children: ReactNodeWithContext
  asChild?: boolean
}

export const PopoverTrigger = forwardRef<
  HTMLElement,
  HTMLProps<HTMLElement> & PopoverTriggerProps
>(function PopoverTrigger({ children, asChild, ...props }, forwardedRef) {
  const context = usePopoverContext()
  const childrenRef = (children as any).ref
  const ref = useMergeRefs([
    context.refs.setReference,
    forwardedRef,
    childrenRef,
  ])

  if (asChild && isValidElement(children)) {
    return cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...props,
        ...children.props,
        'data-state': context.open ? 'open' : 'closed',
      }),
    )
  }

  return (
    <button
      ref={ref}
      type="button"
      data-state={context.open ? 'open' : 'closed'}
      {...context.getReferenceProps(props)}
    >
      <InjectContext>{children}</InjectContext>
    </button>
  )
})

export const PopoverClose = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(function PopoverClose({ children, ...props }, forwardedRef) {
  const { setOpen } = usePopoverContext()
  return (
    <button
      ref={forwardedRef}
      type="button"
      {...props}
      onClick={(event) => {
        props.onClick?.(event)
        setOpen(false)
      }}
    >
      {children}
    </button>
  )
})

interface PopoverContentProps {
  children: ReactNodeWithContext
}

export const PopoverContent = forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement> & PopoverContentProps
>(function PopoverContent({ children, style, ...props }, forwardedRef) {
  const { context: floatingContext, ...context } = usePopoverContext()
  const ref = useMergeRefs([context.refs.setFloating, forwardedRef])

  if (!floatingContext.open) return null

  return (
    <FloatingPortal>
      <FloatingFocusManager context={floatingContext} modal={context.modal}>
        <div
          ref={ref}
          style={{ ...context.floatingStyles, ...style }}
          {...context.getFloatingProps(props)}
        >
          <InjectContext>{children}</InjectContext>
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  )
})

const PopoverComponent = ({
  trigger,
  content,
  ...options
}: PopoverOptions & {
  trigger: ReactNodeWithContext
  content: ReactNodeWithContext
}) => {
  return (
    <Popover {...options}>
      <PopoverTrigger>
        <InjectContext>{trigger}</InjectContext>
      </PopoverTrigger>
      <PopoverContent className="rounded border border-neutral bg-white px-[20px] py-[10px]">
        <InjectContext>{content}</InjectContext>
      </PopoverContent>
    </Popover>
  )
}

export default PopoverComponent
