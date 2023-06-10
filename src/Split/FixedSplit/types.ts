import { ReactNode } from 'react';

export type SiblingInfo = {
  startRect: DOMRect | null;
};

export type MousePosition = { x: number; y: number };

export type Direction = 'horizontal' | 'vertical';

export type ItemSizes = number | number[];

type GutterHTMLProps = Omit<
  React.HTMLProps<HTMLDivElement>,
  'ref' | 'className' | 'onMouseDown'
>;
export interface GutterProps extends GutterHTMLProps {
  index: number;
  direction?: Direction;
  minItemSizes: ItemSizes;
  onGutterDown?: () => void;
  onGutterMove: (newSiblingSizes: number[]) => void;
  onGutterUp?: () => void;
}

type FixedSplitHTMLProps = Omit<
  React.HTMLProps<HTMLDivElement>,
  | 'children'
  | 'direction'
  | 'minItemSizes'
  | 'itemSizes'
  | 'gutterSize'
  | 'gutterStyle'
  | 'onChange'
  | 'onGutterDown'
  | 'onGutterMove'
  | 'onGutterUp'
>;
export interface FixedSplitProps extends FixedSplitHTMLProps {
  children: ReactNode;
  direction?: Direction;
  minItemSizes?: ItemSizes;
  itemSizes?: ItemSizes;
  gutterSize?: number;
  gutterStyle?: React.CSSProperties;
  onChange?: (itemSizes: number[]) => void;
  onGutterDown?: (itemSizes: number[]) => void;
  onGutterMove?: (itemSizes: number[]) => void;
  onGutterUp?: (itemSizes: number[]) => void;
}
