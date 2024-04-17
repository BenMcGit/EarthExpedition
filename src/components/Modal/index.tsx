'use client'
//TODO: tooltip, Modal can abstract out popup
import { ReactNode, useCallback } from 'react'
import {
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useId,
  FloatingOverlay,
  FloatingFocusManager,
} from '@floating-ui/react'
import { atom, useAtom, useSetAtom } from 'jotai'
import cx from 'clsx'
import { uniqueId } from 'lodash-es'
import { CloseIcon } from '../Icons'
import renderReactNode from '@/utils/renderReactNode'

export interface Modal {
  id: string
  title: string
  content: ReactNode
  headClass?: string
  containerClass?: string
  wrapperClass?: string
}
const isOpenAtom = atom(false)
const modalAtom = atom<Modal | null>(null)

export const useModal = (param?: Omit<Modal, 'id'>) => {
  const setIsOpen = useSetAtom(isOpenAtom)
  const setModal = useSetAtom(modalAtom)

  const showModal = useCallback(() => {
    if (!param) return
    setModal({ ...param, id: uniqueId() })
    setIsOpen(true)
  }, [])

  const hideModal = useCallback(() => {
    setIsOpen(false)
    setModal(null)
  }, [])

  return { showModal, hideModal }
}

const ModalRender: React.FC = () => {
  const [isOpen, setIsOpen] = useAtom(isOpenAtom)
  const [modal, setModal] = useAtom(modalAtom)
  const handleOpen = useCallback((open: boolean, event?: Event) => {
    setIsOpen(open)
    if (!open) setModal(null)
  }, [])

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: handleOpen,
  })

  const click = useClick(context)

  const dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown',
  })

  const role = useRole(context)

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ])

  const labelId = useId()

  const descriptionId = useId()

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}></div>
      {isOpen && (
        <FloatingOverlay
          lockScroll
          style={{ background: 'rgba(0, 0, 0, 0.7)', zIndex: 10 }}
          className={cx(
            'flex items-center justify-center backdrop-blur-[15px]',
            modal?.containerClass
          )}
        >
          <FloatingFocusManager context={context}>
            <div
              ref={refs.setFloating}
              aria-labelledby={labelId}
              aria-describedby={descriptionId}
              {...getFloatingProps()}
            >
              <div
                className={cx(
                  'p-[27px] min-w-[311px] rounded-[12px] border-[1px] border-solid border-[#ffffff] bg-[rgba(255,255,255,0.12)] backdrop-blur-[103px]',
                  modal?.wrapperClass
                )}
              >
                <div
                  className={cx(
                    'flex justify-between items-center h-[36px] text-[24px] leading-[36px] -tracking-[0.46px] text-[#fff] font-semibold',
                    modal?.headClass
                  )}
                >
                  {modal?.title}
                  <div
                    className="w-fit h-fit -translate-y-[11px] cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    <CloseIcon />
                  </div>
                </div>
                {/* <div className="h-[1px] bg-[#EBEDF0] pointer-events-none" /> */}
                <div className="pt-[29px]">
                  {renderReactNode(modal?.content)}
                </div>
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      )}
    </>
  )
}

export default ModalRender
