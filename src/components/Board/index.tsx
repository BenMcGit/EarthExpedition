'use client'
import React, { type HTMLAttributes } from 'react'
// import { atom, useAtom } from 'jotai'
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import cx from 'clsx'
import { CloseIcon } from '../Icons'

interface Props {
  title?: string
  children?: React.ReactNode
}

export interface ShowBoardStore {
  showBoard: boolean
  setShowBoard: (showBoard: boolean) => void
  toggleShowBoard: () => void
}

// const showBoardAtom = atom(false)
export const useShowBoardStore = create<ShowBoardStore>((set) => ({
  showBoard: false,
  toggleShowBoard: () => set((state) => ({ showBoard: !state.showBoard })),
  setShowBoard: (showBoard) => set({ showBoard }),
}))

// export const toggleShowBoardAtom = atom(
//   (get) => get(showBoardAtom),
//   (get, set) => {
//     const update = !get(showBoardAtom)
//     set(showBoardAtom, update)
//   }
// )ƒ

const Board: React.FC<HTMLAttributes<HTMLDivElement> & Props> = ({
  className,
  title,
  children,
}) => {
  // const [showBoard, setShowBoard] = useAtom(showBoardAtom)
  const { showBoard, toggleShowBoard } = useShowBoardStore(
    useShallow((state) => ({
      showBoard: state.showBoard,
      toggleShowBoard: state.toggleShowBoard,
    })),
  )

  return (
    <div
      className={cx(
        'p-[24px] text-[16px] leading-[24px] rounded-[12px] border-[1px] border-solid border-[#f7f7f7] bg-[rgba(255,255,255,0.08)] backdrop-blur-[24px] z-[1000]',
        'pb-20px',
        !showBoard && '!hidden',
        className,
      )}
    >
      <div className="flex flex-row items-center justify-between">
        <p className="flex items-center text-[24px] leading-[36px] text-[#000000] font-semibold">
          {title}
        </p>
        <div className="w-fit h-fit cursor-pointer" onClick={toggleShowBoard}>
          <CloseIcon />
        </div>
      </div>
      {children}
    </div>
  )
}

export default Board
