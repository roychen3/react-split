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
  onGutterDown?: (event: MouseEvent) => void;
  onGutterMove?: ({
    newSiblingSizes,
    moveDistance,
    event,
  }: {
    newSiblingSizes: number[];
    moveDistance: number;
    event: MouseEvent;
  }) => void;
  onGutterUp?: ({
    moveDistance,
    event,
  }: {
    moveDistance: number;
    event: MouseEvent;
  }) => void;
}

export type GutterEvent = {
  itemSizes: number[];
  moveDistance: number;
  event: MouseEvent;
};
export interface SplitProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  direction?: Direction;
  minItemSizes?: ItemSizes;
  itemSizes?: ItemSizes;
  gutterSize?: number;
  gutterStyle?: React.CSSProperties;
  onGutterDown?: ({
    itemSizes,
    moveDistance,
    event,
  }: GutterEvent) => void;
  onGutterMove?: ({
    itemSizes,
    moveDistance,
    event,
  }: GutterEvent) => void;
  onGutterUp?: ({
    itemSizes,
    moveDistance,
    event,
  }: GutterEvent) => void;
}
