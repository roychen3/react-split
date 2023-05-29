import { ReactNode } from 'react';

export type SiblingInfo = {
  startRect: DOMRect | null;
  element: HTMLElement | null;
};

export type MousePosition = { x: number; y: number };

export type Direction = 'horizontal' | 'vertical';

export interface GutterProps {
  direction: Direction;
  flexContainer: boolean;
  itemSizes: number[];
  onGutterDown?: (event: MouseEvent) => void;
  onGutterMove?: (event: MouseEvent) => void;
  onGutterUp?: (event: MouseEvent) => void;
}

export interface SplitProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  direction?: Direction;
  flexContainer?: boolean;
  itemSizes?: number[];
  gutterStyle?: React.CSSProperties;
  onGutterDown?: (event: MouseEvent) => void;
  onGutterMove?: (event: MouseEvent) => void;
  onGutterUp?: (event: MouseEvent) => void;
}
