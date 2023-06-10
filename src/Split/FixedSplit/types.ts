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
  itemSizes: number[];
  onGutterDown?: (event: React.MouseEvent) => void;
  onGutterMove: ({
    newSiblingSizes,
    moveDistance,
  }: {
    newSiblingSizes: number[];
    moveDistance: number;
  }) => void;
  onGutterUp?: ({ moveDistance }: { moveDistance: number }) => void;
}

export type GutterEvent = {
  itemSizes: number[];
  moveDistance: number;
};
export interface FixedSplitProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  direction?: Direction;
  minItemSizes?: ItemSizes;
  itemSizes?: ItemSizes;
  gutterSize?: number;
  gutterStyle?: React.CSSProperties;
  onGutterDown?: ({ itemSizes, moveDistance }: GutterEvent) => void;
  onGutterMove?: ({ itemSizes, moveDistance }: GutterEvent) => void;
  onGutterUp?: ({ itemSizes, moveDistance }: GutterEvent) => void;
}
