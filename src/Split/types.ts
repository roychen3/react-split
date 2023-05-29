import { ReactNode } from 'react';

export type SiblingInfo = {
  startRect: DOMRect | null;
  element: HTMLElement | null;
};

export type MousePosition = { x: number; y: number };

export type Direction = 'horizontal' | 'vertical';

export type ItemSizes = number | number[]

type GutterHTMLProps = Omit<React.HTMLProps<HTMLDivElement>,
  | 'ref'
  | 'className'
  | 'onMouseDown'
>
export interface GutterProps extends GutterHTMLProps {
  index: number;
  direction?: Direction;
  flexContainer?: boolean;
  minItemSizes?: ItemSizes;
  itemSizes?: ItemSizes;
  onGutterDown?: (event: MouseEvent) => void;
  onGutterMove?: (event: MouseEvent) => void;
  onGutterUp?: (event: MouseEvent) => void;
}

export interface SplitProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  direction?: Direction;
  flexContainer?: boolean;
  minItemSizes?: ItemSizes;
  itemSizes?: ItemSizes;
  gutterStyle?: React.CSSProperties;
  onGutterDown?: (itemSizes: ItemSizes, event: MouseEvent) => void;
  onGutterMove?: (itemSizes: ItemSizes, event: MouseEvent) => void;
  onGutterUp?: (itemSizes: ItemSizes, event: MouseEvent) => void;
}
