'use client';
import React, { useEffect, useCallback, HTMLAttributes } from 'react';
// import { atom, useAtom } from 'jotai'
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import cx from 'clsx';
import { useSpring, animated as a } from '@react-spring/web';
import { CloseIcon } from '@/components/Icons';

interface Props {
  title?: string;
  children?: React.ReactNode;
}

export interface ShowBoardStore {
  showBoard: boolean;
  setShowBoard: (showBoard: boolean) => void;
}

// const showBoardAtom = atom(false)
export const useShowBoardStore = create<ShowBoardStore>((set) => ({
  showBoard: false,
  setShowBoard: (showBoard) => set({ showBoard }),
}));

const selectors = {
  board: (state: ShowBoardStore) => state,
  showBoard: (state: ShowBoardStore) => state.showBoard,
  setShowBoard: (state: ShowBoardStore) => state.setShowBoard,
};

export const useSetShowBoard = () => useShowBoardStore(selectors.setShowBoard);
export const useShowBoard = () => useShowBoardStore(selectors.showBoard);
export const useBoard = () => useShowBoardStore(selectors.board);

const Board: React.FC<HTMLAttributes<HTMLDivElement> & Props> = ({
  className,
  title,
  children,
}) => {
  const { showBoard, setShowBoard } = useBoard();

  const [springs, api] = useSpring(() => ({
    from: {
      transform: 'scale(1,0)',
    },
    to: {
      transform: 'scale(1,1)',
    },
    duration: 500,
  }));

  const handleClose = useCallback(() => {
    setShowBoard(false);
  }, []);

  useEffect(() => {
    if (!showBoard) return;
    api.start({
      from: {
        transform: 'scale(1,0)',
      },
      to: {
        transform: 'scale(1,1)',
      },
    });
  }, [showBoard]);

  return (
    <a.div
      style={springs}
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
        <div className="w-fit h-fit cursor-pointer" onClick={handleClose}>
          <CloseIcon />
        </div>
      </div>
      {children}
    </a.div>
  );
};

export default Board;
